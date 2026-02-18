import os
import uuid
import io
from datetime import datetime

import torch
import docx
import PyPDF2
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    T5Tokenizer,
    T5ForConditionalGeneration,
)

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

# ── Load models once when the router is imported ──────────────────────────────
MODEL_DIR = "/home/bipin/Desktop/minor_project/models"

print("Loading classifier...")
c_tok = BertTokenizer.from_pretrained(
    os.path.join(MODEL_DIR, "classifier_model"), local_files_only=True
)
c_model = BertForSequenceClassification.from_pretrained(
    os.path.join(MODEL_DIR, "classifier_model"), local_files_only=True
)
c_model.eval()

print("Loading summarizer...")
s_tok = T5Tokenizer.from_pretrained(
    os.path.join(MODEL_DIR, "summarizer_model"), local_files_only=True
)
s_model = T5ForConditionalGeneration.from_pretrained(
    os.path.join(MODEL_DIR, "summarizer_model"), local_files_only=True
)
s_model.eval()

LABELS = ["notice", "suggestion", "complaint", "feedback"]
print("Models ready!")


# ── Helpers ───────────────────────────────────────────────────────────────────
def extract_text(file_bytes: bytes, extension: str) -> str:
    """Extract plain text from TXT, DOCX or PDF bytes."""
    if extension == ".txt":
        return file_bytes.decode("utf-8")

    elif extension == ".docx":
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

    elif extension == ".pdf":
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        return "".join([page.extract_text() or "" for page in reader.pages])

    raise ValueError(f"Unsupported extension: {extension}")


def classify(text: str) -> tuple[str, float, dict]:
    """Return predicted label, confidence and all scores."""
    inputs = c_tok(text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        probs = torch.nn.functional.softmax(c_model(**inputs).logits, dim=-1)
        pred = torch.argmax(probs).item()
        conf = float(probs[0][pred].item())

    all_scores = {LABELS[i]: float(probs[0][i].item()) for i in range(len(LABELS))}
    return LABELS[pred], conf, all_scores


def summarize(text: str) -> str:
    """Return a summary of the given text."""
    inputs = s_tok(
        "summarize: " + text, return_tensors="pt", truncation=True, max_length=512
    )
    with torch.no_grad():
        out = s_model.generate(inputs.input_ids, max_length=128, num_beams=4)
    return s_tok.decode(out[0], skip_special_tokens=True)


# ── Route ─────────────────────────────────────────────────────────────────────
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

    # Read file bytes
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

    # Run models
    try:
        label, confidence, all_scores = classify(text)
        summary = summarize(text)
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
            "originalLength": len(text),
            "summaryLength": len(summary),
        }
    )
