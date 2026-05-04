"""
Authentication endpoints: signup, login, refresh token
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
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
from app.oauth import oauth, build_frontend_redirect_url, GOOGLE_OAUTH_REDIRECT_URI

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


@router.get("/google/login")
async def google_login(request: Request):
    """Redirect to Google's OAuth consent screen."""
    return await oauth.google.authorize_redirect(request, GOOGLE_OAUTH_REDIRECT_URI)


@router.get("/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback and issue JWT tokens."""
    print(f"🔐 Google callback received")
    
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as exc:
        print(f"❌ authorize_access_token failed: {exc}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to authorize with Google: {str(exc)}",
        )

    # Extract userinfo from token
    userinfo = None
    
    # First, try getting userinfo dict from token (standard with openid scope)
    if isinstance(token, dict):
        userinfo = token.get("userinfo")
    
    # If userinfo not in token, parse it from id_token
    if not userinfo:
        try:
            id_token_str = token.get("id_token") if isinstance(token, dict) else None
            if id_token_str:
                # Use jose to decode the JWT
                from jose import jwt
                userinfo = jwt.decode(
                    id_token_str,
                    GOOGLE_CLIENT_SECRET,
                    algorithms=["RS256"],
                    options={"verify_signature": False},  # Google's public key verification
                )
            else:
                # Try calling parse_id_token
                userinfo = await oauth.google.parse_id_token(request, token)
        except Exception as e:
            print(f"⚠️  Could not parse id_token: {e}")
    
    # Fallback: fetch userinfo from Google API
    if not userinfo:
        try:
            import httpx
            access_token_str = token.get("access_token") if isinstance(token, dict) else None
            if access_token_str:
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        "https://www.googleapis.com/oauth2/v2/userinfo",
                        headers={"Authorization": f"Bearer {access_token_str}"},
                    )
                    if response.status_code == 200:
                        userinfo = response.json()
        except Exception as e:
            print(f"❌ Failed to fetch userinfo: {e}")

    if not userinfo:
        print(f"❌ Could not extract userinfo from token")
        print(f"   Token keys: {token.keys() if isinstance(token, dict) else 'not a dict'}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to extract user information from Google token",
        )

    email = userinfo.get("email")
    google_id = userinfo.get("sub")
    
    if not email or not google_id:
        print(f"❌ Missing required fields: email={email}, sub={google_id}")
        print(f"   Available keys in userinfo: {list(userinfo.keys())}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google user profile missing email or ID",
        )

    print(f"✅ Google auth successful: {email}")

    # Find or create user
    stmt = select(User).where(User.google_id == google_id)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        # Try to find by email
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalars().first()

    if user:
        # Update google_id if not set
        if not user.google_id:
            user.google_id = google_id
            db.add(user)
            await db.commit()
            await db.refresh(user)
    else:
        # Create new user
        user = User(email=email, google_id=google_id, password_hash="")
        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"✅ Created new user: {user.email}")

    # Issue JWT tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Redirect to frontend with tokens
    redirect_url = build_frontend_redirect_url(access_token, refresh_token, user)
    print(f"🔗 Redirecting to frontend")
    return RedirectResponse(redirect_url, status_code=302)


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
