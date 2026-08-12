from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth
from .core.config import settings
from .db.session import engine
from .models.user import Base

app = FastAPI(title="MediLens-AI Backend (scaffold)")

# Install CORS for the documented Next frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
async def on_startup():
    # ensure tables exist for the scaffold (useful for sqlite local quickstart)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def root():
    return {"status": "ok", "service": "medilens-backend"}
