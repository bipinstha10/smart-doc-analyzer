from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
from urllib.parse import urlencode

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_OAUTH_REDIRECT_URI = os.getenv(
    "GOOGLE_OAUTH_REDIRECT_URI",
    "http://localhost:8000/auth/google/callback",
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-secret-key-change-in-production")

if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise ValueError(
        "Google OAuth credentials are required. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
    )

oauth = OAuth()

oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def build_frontend_redirect_url(access_token: str, refresh_token: str, user) -> str:
    params = {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "user_email": user.email,
        "user_created_at": user.created_at.isoformat(),
    }
    return f"{FRONTEND_URL}/oauth-success?{urlencode(params)}"
