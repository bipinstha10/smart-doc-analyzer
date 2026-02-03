from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload

app = FastAPI()

# CORS — allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React app's URL (Vite default)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(upload.router)
