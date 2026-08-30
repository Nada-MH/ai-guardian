import os
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/ai_guardian_db"
)

try:
    if "postgresql" in DATABASE_URL:
        # Check if psycopg2 is available
        import psycopg2  # noqa: F401
    engine = create_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
        echo=False
    )
except Exception:
    # Fallback to SQLite for local development & test runner environments
    sqlite_path = os.path.join(os.path.dirname(__file__), "ai_guardian_dev.db")
    engine = create_engine(
        f"sqlite:///{sqlite_path}",
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session() -> Generator[Session, None, None]:
    """Dependency injector for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_pgvector_extension():
    """Enable vector extension in PostgreSQL database."""
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
    except Exception:
        pass
