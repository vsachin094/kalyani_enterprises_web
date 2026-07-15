import os
from datetime import timedelta
from urllib.parse import quote

try:
    import psycopg  # noqa: F401
    DRIVER_PREFIX = 'postgresql+psycopg://'
except ImportError:  # pragma: no cover - runtime environment dependent
    DRIVER_PREFIX = 'postgresql://'


def build_database_url(env=None):
    env = env or os.environ
    database_url = env.get('DATABASE_URL') or env.get('POSTGRES_URL')
    if database_url:
        return database_url

    db_user = env.get('DB_USER') or env.get('POSTGRES_USER') or env.get('DATABASE_USER') or 'postgres'
    db_password = env.get('DB_PASSWORD') or env.get('POSTGRES_PASSWORD') or env.get('DATABASE_PASSWORD') or ''
    db_host = env.get('DB_HOST') or env.get('POSTGRES_HOST') or 'localhost'
    db_port = env.get('DB_PORT') or env.get('POSTGRES_PORT') or '5432'
    db_name = env.get('DB_NAME') or env.get('POSTGRES_DB') or env.get('DATABASE_NAME')

    if not db_name:
        return 'sqlite:///kalyani_shop.db'

    return f"{DRIVER_PREFIX}{quote(db_user)}:{quote(db_password)}@{db_host}:{db_port}/{db_name}"


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = build_database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = 'static/images/products'
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    DEFAULT_ADMIN_EMAIL = os.environ.get('DEFAULT_ADMIN_EMAIL', 'admin@shop.com')
    DEFAULT_ADMIN_PASSWORD = os.environ.get('DEFAULT_ADMIN_PASSWORD', 'admin123')
