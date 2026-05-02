"""
Database connection and session management using asyncpg
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file")

print(
    f"🔗 Connecting to: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'database'}"
)

# Create async engine with asyncpg driver
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True to see all SQL queries
    future=True,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=20,  # Connection pool size
    max_overflow=0,  # Don't create extra connections
)

# Async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    future=True,
)

# Base class for all models
Base = declarative_base()


# Dependency for FastAPI - yields database session for each request
async def get_db():
    """
    FastAPI dependency that provides an async database session.

    Usage in endpoints:
    @app.get("/users")
    async def get_users(db: AsyncSession = Depends(get_db)):
        ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
