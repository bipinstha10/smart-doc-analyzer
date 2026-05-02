"""
Authentication endpoints: signup, login, refresh token
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import User
from app.schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    TokenRefresh,
    RefreshTokenResponse,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with email and password.

    Returns:
        Access token, refresh token, and user info
    """
    # Check if user already exists
    stmt = select(User).where(User.email == user_data.email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Return tokens and user info
    return {
        "access_token": create_access_token(new_user.id),
        "refresh_token": create_refresh_token(new_user.id),
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "created_at": new_user.created_at,
        },
    }


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login with email and password.

    Returns:
        Access token, refresh token, and user info
    """
    # Find user by email
    stmt = select(User).where(User.email == user_data.email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    # Verify credentials
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    # Return tokens
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "created_at": user.created_at},
    }


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_access_token(token_data: TokenRefresh):
    """
    Refresh access token using refresh token.

    Returns:
        New access token
    """
    # Decode refresh token
    user_id = decode_token(token_data.refresh_token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # Return new access token
    return {"access_token": create_access_token(user_id), "token_type": "bearer"}
