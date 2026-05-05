"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ===== USER SCHEMAS =====


class UserCreate(BaseModel):
    """Schema for creating a new user"""

    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response"""

    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True  # Convert SQLAlchemy models to Pydantic


class TokenResponse(BaseModel):
    """Schema for token response after login/signup"""

    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse


class TokenRefresh(BaseModel):
    """Schema for token refresh request"""

    refresh_token: str


class RefreshTokenResponse(BaseModel):
    """Schema for token refresh response"""

    access_token: str
    token_type: str


# ===== DOCUMENT SCHEMAS =====


class DocumentCreate(BaseModel):
    """Schema for creating a document"""

    content: Optional[str] = None
    # File is handled separately as UploadFile


class DocumentResponse(BaseModel):
    """Schema for single document response"""

    id: int
    category: str
    confidence_score: float
    summary: Optional[str] = None
    created_at: datetime
    original_content: str
    all_scores: Optional[dict[str, float]] = None

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """Schema for document in list view"""

    id: int
    category: str
    confidence_score: float
    summary: Optional[str] = None
    created_at: datetime
    original_content: str

    class Config:
        from_attributes = True


class SummaryResponse(BaseModel):
    """Schema for summarize endpoint response"""

    summary: str


class DeleteResponse(BaseModel):
    """Schema for delete endpoint response"""

    message: str
