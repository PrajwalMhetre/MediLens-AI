# MediLens AI Deployment Guide

This project ships as a three-service production-style stack:

- **Frontend:** Flutter Web compiled to static assets and served by Nginx.
- **Backend:** FastAPI served by Uvicorn.
- **DBMS:** PostgreSQL 16 with a named Docker volume for persistent data.

## Local full-stack deployment

```sh
cp .env.example .env
docker compose up --build
```

Open:

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Backend health check: http://localhost:8000/health
- Swagger API docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432

## Environment variables

| Variable | Service | Description |
| --- | --- | --- |
| `API_BASE_URL` | Frontend build | REST base URL compiled into Flutter Web. |
| `API_TITLE` | Backend | FastAPI title. |
| `CORS_ORIGINS` | Backend | Comma-separated allowed browser origins. |
| `POSTGRES_DB` | Database | PostgreSQL database name. |
| `POSTGRES_USER` | Database | PostgreSQL user. |
| `POSTGRES_PASSWORD` | Database | PostgreSQL password. |
| `DATABASE_URL` | Backend | SQLAlchemy URL. Use `postgresql+psycopg://...` for PostgreSQL. |

## CI/CD pipeline

GitHub Actions runs on pushes to `main`/`master` and pull requests:

1. Installs Python dependencies and compiles the FastAPI backend.
2. Boots the backend against a PostgreSQL service and verifies `/health`.
3. Installs Flutter dependencies, runs `flutter analyze`, runs `flutter test`, and builds Flutter Web.
4. Builds both Docker images to prove deployment artifacts can be produced.

The workflow is defined in `.github/workflows/ci-cd.yml`.

## Production deployment checklist

1. Create managed PostgreSQL database and store its connection string as `DATABASE_URL`.
2. Build and publish backend and frontend Docker images from the CI workflow.
3. Deploy backend with `DATABASE_URL`, `API_TITLE`, and locked-down `CORS_ORIGINS`.
4. Deploy frontend with `API_BASE_URL` pointing at the public backend `/api` URL.
5. Enable TLS, request logging, health probes against `/health`, and database backups.
6. Rotate demo database credentials before exposing the stack publicly.
