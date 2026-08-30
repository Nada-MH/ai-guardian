import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # App
    APP_NAME: str = "AI Guardian"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ai_guardian_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Auth
    JWT_SECRET_KEY: str = "ai-guardian-dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Object Storage (MinIO / S3)
    STORAGE_BACKEND: str = "local"  # "local" | "s3" | "minio"
    STORAGE_LOCAL_PATH: str = "./uploads"
    S3_BUCKET_NAME: str = "ai-guardian-docs"
    S3_ENDPOINT_URL: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None

    # LLM Provider
    LLM_PROVIDER: str = "openai"  # "openai" | "anthropic" | "google"
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Embedding
    EMBEDDING_MODEL: str = "text-embedding-3-large"
    EMBEDDING_DIMENSION: int = 1536

    # Vector DB
    VECTOR_DB_PROVIDER: str = "qdrant"  # "qdrant" | "pgvector"
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 50
    ALLOWED_FILE_EXTENSIONS: str = ".pdf,.docx,.txt,.csv,.json"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
