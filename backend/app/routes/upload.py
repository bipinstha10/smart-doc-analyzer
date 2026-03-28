import os
import re
import io
import uuid
import time
from datetime import datetime

import numpy as np
import torch
import docx
import PyPDF2
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    BartTokenizer,
    BartForConditionalGeneration,
)

try:
    from peft import PeftModel

    PEFT_AVAILABLE = True
except ImportError:
    PEFT_AVAILABLE = False

router = APIRouter()

# ──────────────────────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────────────────────
_HERE = os.path.dirname(os.path.abspath(__file__))  # .../backend/
MODEL_DIR = os.path.normpath(os.path.join(_HERE, "..", "..", "..", "model"))
CLASSIFIER_DIR = os.path.join(MODEL_DIR, "classifier_model")
DISTILBART_DIR = os.path.join(MODEL_DIR, "distilbart-summarizer-finetuned")
DISTILBART_BASE = "sshleifer/distilbart-cnn-12-6"

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
BERT_MAX_LEN = 128
MAX_INPUT_LEN = 512
MAX_TARGET_LEN = 128

LABEL_NAMES = ["notice", "feedback", "complaint"]

# Label-specific DistilBART generation settings
DISTILBART_GEN = {
    "notice": {
        "max_new_tokens": MAX_TARGET_LEN,
        "num_beams": 4,
        "length_penalty": 1.2,
        "no_repeat_ngram_size": 4,
        "repetition_penalty": 1.3,
    },
    "feedback": {
        "max_new_tokens": MAX_TARGET_LEN,
        "num_beams": 4,
        "length_penalty": 1.0,
        "no_repeat_ngram_size": 4,
        "repetition_penalty": 1.3,
    },
    "complaint": {
        "max_new_tokens": MAX_TARGET_LEN,
        "num_beams": 4,
        "length_penalty": 1.0,
        "no_repeat_ngram_size": 4,
        "repetition_penalty": 1.2,
    },
}

# ──────────────────────────────────────────────────────────────
# MODEL LOADING  (runs once at import time)
# ──────────────────────────────────────────────────────────────
print("Loading BERT classifier...")
c_tok = BertTokenizer.from_pretrained(CLASSIFIER_DIR, local_files_only=True)
c_model = BertForSequenceClassification.from_pretrained(
    CLASSIFIER_DIR, local_files_only=True
).to(DEVICE)
c_model.eval()

print("Loading DistilBART summarizer...")
if not PEFT_AVAILABLE:
    raise RuntimeError("peft package is required. Run: pip install peft")

s_tok = BartTokenizer.from_pretrained(DISTILBART_DIR, local_files_only=True)
_base = BartForConditionalGeneration.from_pretrained(DISTILBART_BASE)
s_model = PeftModel.from_pretrained(_base, DISTILBART_DIR)
s_model = s_model.to(DEVICE)
s_model.eval()


print(f"Models ready! Running on {DEVICE.upper()}")

# ──────────────────────────────────────────────────────────────
# TEXT HELPERS
# ──────────────────────────────────────────────────────────────


def extract_text(file_bytes: bytes, extension: str) -> str:
    """Extract plain text from TXT, DOCX, or PDF bytes."""
    if extension == ".txt":
        return file_bytes.decode("utf-8")
    elif extension == ".docx":
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    elif extension == ".pdf":
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        return "".join([page.extract_text() or "" for page in reader.pages])
    raise ValueError(f"Unsupported extension: {extension}")


def normalize_input(text: str) -> str:
    """Fix common input spacing issues before sending to the model."""
    titles = ["Dr", "Mr", "Mrs", "Ms", "Prof", "St", "Jr", "Sr", "Rev", "Lt", "Col"]
    for t in titles:
        text = re.sub(rf"\b{t}\.(?=[A-Z])", f"{t}. ", text)
    text = re.sub(r"([a-z])\.([A-Z])", r"\1. \2", text)
    text = re.sub(r",(?=[^\s])", ", ", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


def format_distilbart_input(label: str, text: str) -> str:
    """Prefix text with label token expected by fine-tuned DistilBART."""
    return f"summarize {label.upper()}: {normalize_input(text)}"


def clean_filler(text: str) -> str:
    """Strip boilerplate openers (Dear Sir, This is to inform you, etc.)."""
    patterns = [
        r"^(?:dear\s+\w+[\s,]+)+",
        r"^greetings from [^.!]+[.!]\s*",
        r"^(?:we\s+(?:are\s+)?(?:pleased|excited|happy|thrilled|delighted)\s+to\s+(?:inform|announce|share|invite)[^,]*,?\s*)",
        r"^(?:this\s+is\s+to\s+(?:inform|notify)\s+(?:you\s+)?(?:all\s+)?(?:that\s+)?)",
        r"^(?:please\s+note\s+that\s+)",
        r"^(?:i\s+hope\s+this\s+(?:email|message)\s+finds\s+you[^.]+\.\s*)",
    ]
    for p in patterns:
        text = re.sub(p, "", text, flags=re.IGNORECASE).strip()
    return text


def keep_first_sentence(text: str) -> str:
    """Truncate to the first complete sentence, respecting common abbreviations."""
    abbrevs = [
        "Dr",
        "Mr",
        "Mrs",
        "Ms",
        "Prof",
        "St",
        "Jr",
        "Sr",
        "vs",
        "etc",
        "approx",
        "Dept",
        "Govt",
        "No",
        "Vol",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Ph",
        "Rev",
        "Lt",
        "Col",
        "Sgt",
        "Pvt",
        "Capt",
        "Gen",
        "Eng",
        "Asst",
        "Assoc",
    ]
    protected = text
    for ab in abbrevs:
        protected = re.sub(rf"\b{ab}\.", f"{ab}<DOT>", protected)

    m = re.search(r"(.+?[.!?])\s+[A-Z]", protected)
    if m:
        return m.group(1).replace("<DOT>", ".").strip()

    restored = protected.replace("<DOT>", ".")
    if re.search(r"[.!?]$", restored.strip()):
        return restored.strip()
    return restored.strip() + "."


def fix_punctuation(text: str) -> str:
    """Normalise spacing around punctuation and capitalise sentences."""
    text = re.sub(r"(\w)\s+[–\-]\s+(\w)", r"\1-\2", text)
    text = re.sub(r"\s+([.,!?;:])", r"\1", text)
    text = re.sub(r"([.,!?;:])([A-Za-z])", r"\1 \2", text)
    text = re.sub(r"\.\.+", ".", text)
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    text = " ".join(s[0].upper() + s[1:] if s else s for s in sentences)
    if text and text[-1] not in ".!?":
        text += "."
    return text.strip()


def enforce_label_format(text: str, label: str) -> str:
    """Remove model output artifacts specific to each label."""
    text = re.sub(r"^summarize\s+\w+\s*:\s*", "", text, flags=re.IGNORECASE).strip()
    text = re.sub(r"\bsummarize\b", "", text, flags=re.IGNORECASE).strip()

    if label in ("feedback", "complaint"):
        text = re.sub(
            r"^(?:Student\s+(?:complains\s+about|suggests\s+(?:that\s+)?|requests\s+(?:that\s+)?"
            r"|appreciates\s+(?:that\s+)?|recommends\s+(?:that\s+)?|mentions\s+(?:that\s+)?"
            r"|notes\s+(?:that\s+)?|feels\s+(?:that\s+)?|reports\s+(?:that\s+)?)"
            r"|Writer\s+(?:appreciates|suggests|complains\s+about|mentions)\s+)",
            "",
            text,
            flags=re.IGNORECASE,
        ).strip()
        if text:
            text = text[0].upper() + text[1:]

    return text.strip()


def extract_notice_details(text: str) -> tuple[str, str, str]:
    """Extract date, time, and venue from notice text."""
    date_str = time_str = venue_str = ""
    for line in text.splitlines():
        s, lo = line.strip(), line.strip().lower()
        if lo.startswith("date") and not date_str:
            date_str = re.sub(r"^date\s*[:\-]?\s*", "", s, flags=re.IGNORECASE).strip()
        if lo.startswith("time") and not time_str:
            time_str = re.sub(r"^time\s*[:\-]?\s*", "", s, flags=re.IGNORECASE).strip()
        if (lo.startswith("venue") or lo.startswith("location")) and not venue_str:
            venue_str = re.sub(
                r"^(?:venue|location)\s*[:\-]?\s*", "", s, flags=re.IGNORECASE
            ).strip()

    if not time_str:
        m = re.search(
            r"\b\d{1,2}[:.]\d{2}\s*(?:am|pm)?\s*(?:–|-|to)\s*\d{1,2}[:.]\d{2}\s*(?:am|pm)?\b"
            r"|\b\d{1,2}[:.]\d{2}\s*(?:am|pm)?\b|\b\d{1,2}\s*(?:am|pm)\b",
            text,
            re.IGNORECASE,
        )
        if m:
            time_str = m.group()

    if not date_str:
        m = re.search(
            r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:\s*[–\-]\s*\d{1,2})?,?\s*\d{2,4}\b"
            r"|\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b"
            r"|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
            text,
            re.IGNORECASE,
        )
        if m:
            date_str = m.group()

    return date_str.strip(), time_str.strip(), venue_str.strip()


def extract_online_mode(text: str) -> bool:
    return any(
        re.search(p, text, re.IGNORECASE)
        for p in [
            r"\bonline\b",
            r"\bvirtual\b",
            r"\bzoom\b",
            r"\bteams\b",
            r"\bgoogle meet\b",
            r"\bwebinar\b",
            r"\blivestream\b",
            r"\bremote\b",
        ]
    )


def extract_conductor(text: str) -> str:
    m = re.search(
        r"(?:conducted|led|facilitated|organized|presented)\s+by\s+"
        r"((?:Dr|Mr|Mrs|Ms|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",
        text,
        re.IGNORECASE,
    )
    return m.group(1).strip() if m else ""


def append_notice_fields(
    summary: str, text: str, date_str: str, time_str: str, venue_str: str
) -> str:
    """Re-attach date/time/venue/conductor details if the model dropped them."""
    is_online = extract_online_mode(text)
    conductor = extract_conductor(text)
    parts = []
    if is_online:
        if "online" not in summary.lower():
            parts.append("conducted online")
    elif venue_str and venue_str.lower() not in summary.lower():
        parts.append(f"at {venue_str}")
    if date_str and date_str.lower() not in summary.lower():
        parts.append(f"on {date_str}")
    if time_str and time_str.lower() not in summary.lower():
        parts.append(f"at {time_str}")
    if conductor and conductor.lower() not in summary.lower():
        parts.append(f"conducted by {conductor}")
    if parts:
        summary = summary.rstrip(".") + ", " + ", ".join(parts) + "."
    return summary


# ──────────────────────────────────────────────────────────────
# INFERENCE
# ──────────────────────────────────────────────────────────────


def classify(text: str) -> tuple[str, float, dict]:
    """Run BERT classifier. Returns (label, confidence, all_scores)."""
    inputs = c_tok(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=BERT_MAX_LEN,
    ).to(DEVICE)
    with torch.no_grad():
        probs = torch.softmax(c_model(**inputs).logits, dim=-1).squeeze().cpu().numpy()

    pred_idx = int(np.argmax(probs))
    label = LABEL_NAMES[pred_idx]
    confidence = float(probs[pred_idx])
    all_scores = {LABEL_NAMES[i]: float(probs[i]) for i in range(len(LABEL_NAMES))}
    return label, confidence, all_scores


def summarize(text: str, label: str) -> tuple[str, float]:
    """Run DistilBART with label-specific generation config. Returns (summary, elapsed_sec)."""
    inp_text = format_distilbart_input(label, text)
    inputs = s_tok(
        inp_text,
        return_tensors="pt",
        max_length=MAX_INPUT_LEN,
        truncation=True,
    ).to(DEVICE)

    cfg = DISTILBART_GEN[label]
    t0 = time.time()
    with torch.no_grad():
        ids = s_model.generate(
            **inputs,
            max_new_tokens=cfg["max_new_tokens"],
            num_beams=cfg["num_beams"],
            length_penalty=cfg["length_penalty"],
            no_repeat_ngram_size=cfg["no_repeat_ngram_size"],
            repetition_penalty=cfg["repetition_penalty"],
            early_stopping=True,
        )
    elapsed = time.time() - t0

    summary = s_tok.decode(ids[0], skip_special_tokens=True)

    # Post-processing pipeline
    summary = clean_filler(summary)
    summary = keep_first_sentence(summary)
    summary = enforce_label_format(summary, label)

    # Cap feedback/complaint at 30 words
    if label in ("complaint", "feedback"):
        words = summary.split()
        if len(words) > 30:
            summary = " ".join(words[:30]).rstrip(".,;:") + "."

    summary = fix_punctuation(summary)

    # Fallback: if model output is too short, use first sentence of input
    if len(summary.split()) <= 3:
        fallback = keep_first_sentence(normalize_input(text))
        if label in ("complaint", "feedback"):
            words = fallback.split()
            if len(words) > 30:
                fallback = " ".join(words[:30]).rstrip(".,;:") + "."
        summary = fix_punctuation(fallback)

    # For notices: re-attach any date/time/venue the model may have dropped
    if label == "notice":
        date_str, time_str, venue_str = extract_notice_details(text)
        summary = append_notice_fields(summary, text, date_str, time_str, venue_str)

    return summary, elapsed


# ──────────────────────────────────────────────────────────────
# ROUTE
# ──────────────────────────────────────────────────────────────


class TextPayload(BaseModel):
    text: str


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    file_bytes = await file.read()

    # Save original file
    unique_name = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Extract text
    try:
        text = extract_text(file_bytes, extension)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not extract text: {str(e)}")

    if not text.strip():
        raise HTTPException(
            status_code=422, detail="Document appears to be empty or unreadable"
        )

    if len(text.split()) < 10:
        raise HTTPException(
            status_code=422, detail="Document too short (need at least 10 words)"
        )

    # Run models
    try:
        label, confidence, all_scores = classify(text)
        summary, inference_time = summarize(text, label)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    return JSONResponse(
        content={
            "id": unique_name,
            "fileName": file.filename,
            "message": "File processed successfully",
            "uploadedAt": datetime.now().isoformat(),
            "category": label,
            "confidence": round(confidence * 100, 2),
            "all_scores": {k: round(v * 100, 2) for k, v in all_scores.items()},
            "summary": summary,
            "inferenceTime": round(inference_time, 2),  # seconds
            "originalLength": len(text.split()),  # word count
            "summaryLength": len(summary.split()),  # word count
        }
    )


@router.post("/text")
async def submit_text(payload: TextPayload):
    """Process raw text input through classification and summarization."""
    text = payload.text.strip()

    if not text:
        raise HTTPException(status_code=422, detail="Text cannot be empty")

    if len(text.split()) < 10:
        raise HTTPException(
            status_code=422, detail="Text too short (need at least 10 words)"
        )

    # Run models
    try:
        label, confidence, all_scores = classify(text)
        summary, inference_time = summarize(text, label)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    return JSONResponse(
        content={
            "id": str(uuid.uuid4()),
            "fileName": "text-input.txt",
            "message": "Text processed successfully",
            "uploadedAt": datetime.now().isoformat(),
            "category": label,
            "confidence": round(confidence * 100, 2),
            "all_scores": {k: round(v * 100, 2) for k, v in all_scores.items()},
            "summary": summary,
            "inferenceTime": round(inference_time, 2),
            "originalLength": len(text.split()),
            "summaryLength": len(summary.split()),
        }
    )
