import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from config import setting
from database import Base, engine
from routers import products, services, queries, feedback, analytics, admin, catalog

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kalyani Enterprises API",
    description="Backend API for Kalyani Enterprises website",
    version="1.0.0",
    docs_url="/api/docs" if setting("app", "environment", "APP_ENV", "development") != "production" else None,
    redoc_url="/api/redoc" if setting("app", "environment", "APP_ENV", "development") != "production" else None,
)


def list_setting(section: str, key: str, env_name: str, default: list[str]) -> list[str]:
    value = setting(section, key, env_name, default)
    return [item.strip() for item in value.split(",") if item.strip()] if isinstance(value, str) else value

# CORS - allow all origins in development, restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=list_setting("app", "cors_origins", "CORS_ORIGINS", ["http://localhost:3000"]),
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=list_setting("app", "allowed_hosts", "ALLOWED_HOSTS", ["localhost", "127.0.0.1"]),
)

# Include API routers
app.include_router(products.router)
app.include_router(services.router)
app.include_router(queries.router)
app.include_router(feedback.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(catalog.router)


# ==================== Serve React Static Files ====================

# Path to the built React frontend
FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend",
    "dist",
)


@app.get("/")
async def serve_root():
    """Serve the React SPA"""
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    return {"message": "Kalyani Enterprises API is running. Frontend not built yet."}


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve React SPA for all non-API routes"""
    # Skip API routes
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}

    # Serve static files if they exist
    frontend_root = Path(FRONTEND_DIST).resolve()
    file_path = (frontend_root / full_path).resolve()
    if frontend_root in file_path.parents and file_path.is_file():
        return FileResponse(file_path)

    # Serve index.html for SPA routing
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)

    return {"detail": "Not Found"}


# Mount static assets if the dist folder exists
assets_dir = os.path.join(FRONTEND_DIST, "assets")
if os.path.isdir(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
