from fastapi import FastAPI
from .api import auth

app = FastAPI(title="MediLens-AI Backend (scaffold)")

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"status": "ok", "service": "medilens-backend"}
