"""
Main FastAPI application with asyncpg support
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.database import engine, Base
from app.routes import auth, documents

# ===== LIFESPAN EVENTS =====


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("🚀 Starting FastAPI application...")

    # Create all tables from models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database tables created successfully")

    yield  # Application runs here

    # Shutdown
    print("🛑 Shutting down application...")
    await engine.dispose()
    print("✅ Database connections closed")


# ===== FASTAPI APP =====

app = FastAPI(
    title="Document Categorizer API",
    description="Upload documents and categorize them as notice, complaint, or feedback",
    version="1.0.0",
    lifespan=lifespan,
)


# ===== CORS MIDDLEWARE =====

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development
        "http://localhost:5173",  # Vite development
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:3001",  # Additional ports
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# ===== ROUTERS =====

app.include_router(auth.router)
app.include_router(documents.router)


# ===== HEALTH CHECK ENDPOINTS =====


@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "Document Categorization API (AsyncPG)",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    """Health check for monitoring"""
    return {"status": "healthy"}


# ===== ERROR HANDLERS =====


from fastapi.responses import JSONResponse


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    print(f"❌ Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
