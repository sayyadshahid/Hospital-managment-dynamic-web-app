# Docker Setup

This project is containerized using Docker Compose. It runs two services (the
database is MongoDB Atlas in the cloud, not a container):

| Service  | Container        | Image / Build      | Port        | Purpose                     |
|----------|------------------|--------------------|-------------|-----------------------------|
| `backend`| `hospital-backend`| `./backend`       | `8000`       | FastAPI + Uvicorn/Gunicorn  |
| `frontend`| `hospital-frontend`| `./frontend`    | `3000 -> 80` | React app served by nginx   |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2 (`docker compose`)

## Getting Started

### 1. Build and start the stack

```bash
docker compose up --build
```

### 2. Access the app

- Frontend (React): http://localhost:3000
- Backend API (FastAPI): http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### 3. Stop the stack

```bash
docker compose down
```

Add `-v` to also delete the named `uploads_data` volume:

```bash
docker compose down -v
```

## Environment / Configuration

### Backend

The backend reads its configuration from `backend/.env` via `env_file`. Compose
also sets these variables explicitly (kept in sync with the `.env`):

| Variable          | Value                 |
|-------------------|-----------------------|
| `MONGO_DB_URL`    | MongoDB Atlas URL     |
| `DATABASE_NAME`   | `hospital-managment`  |

The `MONGO_DB_URL` points to a MongoDB Atlas cluster (contains the production
data). All other variables in `backend/.env` (Gemini API key, SMTP, Razorpay,
etc.) are passed through unchanged.

> **Using a different database?** Change `MONGO_DB_URL` and `DATABASE_NAME`
> under `environment:` in `docker-compose.yml`, or edit `backend/.env`.

### Frontend

The API base URLs are baked into the frontend build at image-build time. They are
passed as build args in `docker-compose.yml` and default to:

| Build arg                  | Value                       |
|----------------------------|-----------------------------|
| `REACT_APP_API_BASE_URL`   | `http://localhost:8000/api/`|
| `REACT_APP_FILE_BASE_URL`  | `http://localhost:8000`     |

Because the browser calls the backend directly, these must use the host port
(`localhost:8000`), not the container name. If you change the backend host port,
update these values and rebuild:

```bash
docker compose up --build frontend
```

## Volumes

| Volume         | Mount              | Purpose                        |
|----------------|--------------------|--------------------------------|
| `uploads_data` | `/app/uploads`     | Persists uploaded/static files |

## Rebuilding after changes

```bash
docker compose up --build --force-recreate
```

To view logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Individual Dockerfiles

- `backend/Dockerfile` — Python 3.12-slim, installs `requirements.txt`, runs
  `gunicorn` with a single `UvicornWorker` on `0.0.0.0:8000`.
- `frontend/Dockerfile` — multi-stage build: `node:20-alpine` runs
  `npm run build`, then `nginx:alpine` serves the static bundle. The SPA routing
  fallback is configured in `frontend/nginx.conf`.
