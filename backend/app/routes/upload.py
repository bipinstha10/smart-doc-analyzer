import os
import uuid
import shutil
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import random

router = APIRouter()

UPLOAD_DIR = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".gif"}

# TODO: Replace these with actual ML model outputs when ready
MOCK_CATEGORIES = ["Complaint", "Notice", "Invitation", "Invoice", "Letter", "Resume"]

MOCK_SUMMARIES = [
    "This document contains a formal complaint regarding a recent service issue that requires immediate attention and resolution.",
    "This is an official notice regarding the upcoming changes in company policy effective next month.",
    "This document serves as an invitation to the annual company event scheduled for the end of this quarter.",
    "This is an invoice for the services rendered during the current billing cycle with a due date of 30 days.",
    "This letter formally acknowledges the receipt of the application and outlines the next steps in the process.",
    "This resume highlights the candidate's professional experience, skills, and educational background.",
]


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Check if file is empty
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Generate a unique file name to avoid duplicates
    unique_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    return JSONResponse(
        content={
            "id": unique_name,
            "fileName": file.filename,
            "message": "File uploaded successfully",
            "uploadedAt": datetime.now().isoformat(),
            # TODO: Replace these with actual ML model outputs when ready
            "category": random.choice(MOCK_CATEGORIES),
            "summary": random.choice(MOCK_SUMMARIES),
        }
    )
