"""
Authentication utilities: password hashing, JWT tokens
"""

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

load_dotenv()

# Configuration from .env
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

# Password hashing context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Bearer token security
security = HTTPBearer()


# ===== PASSWORD FUNCTIONS =====


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password"""
    return pwd_context.verify(plain_password, hashed_password)


# ===== JWT TOKEN FUNCTIONS =====


def create_token(data: dict, expires_in_minutes: int) -> str:
    """
    Create JWT token with expiration.

    Args:
        data: Dictionary to encode (e.g., {"sub": user_id})
        expires_in_minutes: Token expiration in minutes

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_in_minutes)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_access_token(user_id: int) -> str:
    """Create access token (short-lived, 15 minutes default)"""
    return create_token({"sub": str(user_id)}, ACCESS_TOKEN_EXPIRE_MINUTES)


def create_refresh_token(user_id: int) -> str:
    """Create refresh token (long-lived, 7 days default)"""
    return create_token({"sub": str(user_id)}, REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60)


def decode_token(token: str) -> Optional[int]:
    """
    Decode JWT token and extract user_id.

    Args:
        token: JWT token string

    Returns:
        user_id if valid, None if invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            return None

        return int(user_id)

    except JWTError:
        return None


# ===== FASTAPI DEPENDENCY =====


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """
    Dependency to get current user from Bearer token.

    Usage in endpoints:
    @app.get("/protected")
    async def protected_endpoint(current_user = Depends(get_current_user)):
        ...
    """
    # Extract token from header
    token = credentials.credentials

    # Decode token
    user_id = decode_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Import here to avoid circular imports
    from app.models import User

    # Verify user still exists
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
