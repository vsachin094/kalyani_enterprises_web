import os
import logging
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from config import setting

logger = logging.getLogger(__name__)

load_dotenv()

data_dir = setting("database", "data_dir", "DATA_DIR", str(Path(__file__).parent)) or str(Path(__file__).parent)
data_dir_path = Path(data_dir)
if not data_dir_path.is_absolute():
    data_dir_path = Path.cwd() / data_dir_path
data_dir_path.mkdir(parents=True, exist_ok=True)
default_db_path = data_dir_path / "database.db"
DATABASE_URL = setting("database", "url", "DATABASE_URL")
sqlite_url = f"sqlite:///{default_db_path}"
database_driver = setting("database", "driver", "DATABASE_DRIVER", "sqlite")
if not DATABASE_URL:
    if database_driver in {"postgres", "postgresql", "postgresql+psycopg"}:
        host = setting("database", "host", "DATABASE_HOST", "127.0.0.1")
        port = setting("database", "port", "DATABASE_PORT", 5432)
        name = setting("database", "name", "DATABASE_NAME", "kalyani_enterprises")
        user = setting("database", "user", "DATABASE_USER", "kalyani")
        password = os.getenv("DATABASE_PASSWORD")
        if password:
            from urllib.parse import quote_plus
            DATABASE_URL = f"postgresql+psycopg://{quote_plus(str(user))}:{quote_plus(password)}@{host}:{port}/{name}"
        else:
            DATABASE_URL = sqlite_url
            logger.warning("DATABASE_PASSWORD is missing; falling back to SQLite")
    else:
        DATABASE_URL = sqlite_url

# Handle Render/Heroku style URLs and use the installed psycopg v3 driver.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
    if not DATABASE_URL.startswith("sqlite"):
        with engine.connect():
            pass
except Exception as error:
    fallback_enabled = setting("database", "fallback_to_sqlite", "DATABASE_FALLBACK_TO_SQLITE", True)
    fallback_enabled = str(fallback_enabled).lower() in {"1", "true", "yes", "on"}
    if DATABASE_URL.startswith("sqlite") or not fallback_enabled:
        raise
    logger.exception("PostgreSQL is unavailable; falling back to SQLite: %s", error)
    DATABASE_URL = sqlite_url
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
