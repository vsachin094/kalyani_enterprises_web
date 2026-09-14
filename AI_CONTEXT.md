# AI Context: Kalyani Enterprises

This file is the maintenance guide for future AI agents working on this repository.

## Product goal

Kalyani Enterprises is a React website for solar, battery, inverter, energy-storage, and related services. The frontend must remain React/Vite and the backend must remain Python/FastAPI. Do not reintroduce a second frontend data source or move business/content management into frontend-only files.

## Repository layout

- `frontend/`: React 19 + Vite + TypeScript + Tailwind CSS.
- `backend/`: FastAPI application, SQLAlchemy models, JSON configuration, seed data, and API routers.
- `backend/seed-data/`: version-controlled initial catalogue, services, testimonials, portfolio, and brand content.
- `deploy/`: nginx and systemd deployment configuration.
- `backend/data/`: runtime SQLite database and uploaded media. It is ignored by Git.

## Runtime architecture

The browser calls `/api/...`. In development, Vite proxies `/api` and `/media` to `http://localhost:8000`. In production, nginx proxies requests to FastAPI, which serves the built React app, `/api`, and `/media`.

Content flows from the database to the React API client:

```text
seed-data/*.json -> seed_data.py -> SQLAlchemy database -> FastAPI -> frontend/src/lib/api.ts -> React pages/components
```

Public catalogue endpoints only return visible products, services, and projects. Public feedback only returns approved entries. Public offers only return active offers whose `expires_at` is empty or in the future.

## Admin capabilities

Admin authentication uses a JWT. The account is always created or updated from `ADMIN_USERNAME` and `ADMIN_PASSWORD` during backend startup. Do not seed credentials, put passwords in JSON, or add a reset-password script unless the security design is explicitly changed.

The admin UI currently supports:

- feedback approval/rejection at `/admin/feedback`;
- anonymous visitor analytics at `/admin/analytics`;
- adding projects, products, and services with image uploads;
- editing existing projects, products, and services, including optional image replacement;
- showing/hiding products, services, and projects;
- publishing offer banners with optional expiry date/time, preview, enable/disable, expiry countdown, and deletion.

The contact form displays the enquiry ID returned by the API as a confirmation reference. Public catalogue and testimonial sections show loading, empty, and retryable error states. Detail/admin routes and the 3D hero scene are lazy-loaded; the 3D scene remains a deliberately larger secondary chunk.

The public offer popup is not rendered on `/admin` routes. Each offer is shown for a maximum of 30 seconds; multiple offers rotate and then the popup closes. Clicking an offer opens an enlarged same-page preview.

## Configuration and secrets

Non-secret defaults belong in `backend/config.json`. Secrets and deployment overrides belong in environment variables or the root `.env` file, which must never be committed.

Required production variables:

- `APP_ENV=production`
- `SECRET_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (at least 8 characters)
- `CORS_ORIGINS`
- `ALLOWED_HOSTS`
- `DATABASE_PASSWORD` when using PostgreSQL fields from `config.json`, or a complete `DATABASE_URL`.

PostgreSQL is preferred when configured. If it is unavailable and `DATABASE_FALLBACK_TO_SQLITE=true`, the app uses SQLite under `DATA_DIR` (normally `backend/data/database.db`). Uploaded images are stored under `DATA_DIR/uploads`.

## Database rules

SQLAlchemy models are in `backend/models.py`. `Base.metadata.create_all()` creates new tables. `main.py` contains small compatibility migrations for columns added after older databases were created. Any new model column must either have a safe default or be added to the compatibility migration.

The admin product form creates both `Product` and `Service` rows; the `type` field distinguishes them. Product/service IDs created by the admin are UUIDs. Seed IDs remain stable slugs for existing detail links.

## Important API conventions

- API response timestamps use snake_case names such as `created_at`, `updated_at`, and `expires_at`.
- Admin endpoints require `Authorization: Bearer <token>`.
- JSON requests must retain `Content-Type: application/json`.
- Upload requests must use `FormData` and must not set a JSON content type.
- A successful delete returns HTTP `204`, with no response body.
- Image upload accepts image MIME types and limits files to 10 MB.

## Safe change workflow

1. Inspect existing routes, models, schemas, and `frontend/src/lib/api.ts` before adding a feature.
2. Add backend schema/model/route support first, then wire the frontend through the API client.
3. Keep public visibility and admin authorization enforced in the backend; frontend hiding is not security.
4. Use `apply_patch` for edits. Do not commit `.env`, runtime databases, uploads, `frontend/dist`, or generated sibling-project artifacts.
5. Run these checks before handoff:

```bash
cd backend
python3 -m py_compile *.py routers/*.py

cd ../frontend
npm run build
```

The virtual environment should also have `fastapi`, `uvicorn`, `sqlalchemy`, `python-multipart`, `python-dotenv`, `passlib`, `python-jose`, `email-validator`, `psycopg`, and `httpx` if using FastAPI `TestClient`.

## Known intentional choices

- Native Python + systemd + nginx is the primary deployment path; Docker is optional.
- JSON seed data is only initial data. Runtime admin changes belong in the database.
- SQLite fallback is for simple local/small deployments; PostgreSQL is the production preference.
- Analytics uses a random anonymous browser ID in local storage. It does not store raw IP addresses.
- `CONTENT_GUIDE.md` describes content concepts; this file describes the live architecture and should be updated when architecture or operational requirements change.
