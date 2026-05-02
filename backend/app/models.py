"""
SQLAlchemy models for database tables
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    """User model - represents a user account"""

    __tablename__ = "users"

    # Primary Key
    id = Column(Integer, primary_key=True, index=True)

    # Fields
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    documents = relationship(
        "Document",
        back_populates="user",
        cascade="all, delete-orphan",  # Delete documents when user is deleted
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class Document(Base):
    """Document model - represents an uploaded document"""

    __tablename__ = "documents"

    # Primary Key & Foreign Key
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Document Content
    original_content = Column(Text, nullable=False)  # Raw text content
    file_path = Column(String, nullable=True)  # Path to stored file (if uploaded)

    # Categorization Results
    category = Column(
        String, nullable=False, index=True
    )  # "notice", "complaint", "feedback"
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    summary = Column(Text, nullable=True)  # Cached summary

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    expires_at = Column(DateTime, nullable=True, index=True)  # For auto-delete

    # Relationships
    user = relationship("User", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id}, category={self.category})>"


# Create indexes for better query performance
Index("idx_user_id_created_at", Document.user_id, Document.created_at)
Index("idx_category_created_at", Document.category, Document.created_at)
