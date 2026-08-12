MediLens-AI backend scaffold

This folder contains a minimal FastAPI scaffold tailored to the stack you described:
- FastAPI (Python 3.12)
- SQLAlchemy 2 (async)
- Alembic (to be configured)
- Pydantic v2
- JWT auth using python-jose
- Passlib (Argon2) for password hashing

Quickstart (local):

1. Create a venv and install deps:
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt

2. Run locally (uses sqlite by default):
   uvicorn app.main:app --reload

3. To use PostgreSQL and Redis with Docker:
   docker compose up --build

Notes:
- Alembic configuration and migrations are intentionally left for the next step (scaffolded models exist in app/models).
- Optional heavy packages (torch, monai, opencv) should be installed in a suitable environment for GPU/CPU inference as needed.
