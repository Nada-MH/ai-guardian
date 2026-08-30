from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text
from src.config import settings

# Convert sync URL to async
_async_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

try:
    engine = create_async_engine(
        _async_url,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
        echo=settings.DEBUG,
    )
except Exception:
    # Fallback to local SQLite async in-memory for standalone dev mode
    try:
        engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    except Exception:
        engine = None

if engine:
    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
else:
    AsyncSessionLocal = None

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initialize database extensions on startup."""
    try:
        async with engine.begin() as conn:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
    except Exception as e:
        import logging
        logging.getLogger("ai_guardian.db").warning(f"Database connection skipped/offline during startup: {e}")
