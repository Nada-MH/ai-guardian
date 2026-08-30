import os
from pydantic_settings import BaseSettings
from typing import Optional

class RAGConfig(BaseSettings):
    """Settings configuration for the RAG & Vector Engine."""

    # Qdrant Vector Store
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: Optional[str] = None
    CORE_GOVERNANCE_COLLECTION: str = "core_ai_governance"
    FINANCE_REGULATORY_COLLECTION: str = "finance_regulatory"
    UPLOADED_DOCS_COLLECTION: str = "uploaded_documents"

    # OpenAI Embeddings
    OPENAI_API_KEY: Optional[str] = None
    EMBEDDING_MODEL: str = "text-embedding-3-large"
    EMBEDDING_DIMENSION: int = 1536

    # Cohere Re-ranker
    COHERE_API_KEY: Optional[str] = None
    RERANK_MODEL: str = "rerank-english-v3.0"
    RERANK_THRESHOLD: float = 0.65

    # Chunking Defaults
    PARENT_CHUNK_SIZE: int = 1500
    CHILD_CHUNK_SIZE: int = 300
    CHUNK_OVERLAP: int = 50

    class Config:
        env_file = ".env"
        case_sensitive = True

rag_config = RAGConfig()
