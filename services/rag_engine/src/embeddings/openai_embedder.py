import logging
from typing import List
from openai import OpenAI
from src.config import rag_config

logger = logging.getLogger("ai_guardian.embeddings")

class OpenAIEmbedder:
    """Generates dense vector embeddings using OpenAI text-embedding-3-large (1536d)."""

    def __init__(self, api_key: str = None, model: str = rag_config.EMBEDDING_MODEL, dimension: int = rag_config.EMBEDDING_DIMENSION):
        self.api_key = api_key or rag_config.OPENAI_API_KEY
        self.model = model
        self.dimension = dimension
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def embed_text(self, text: str) -> List[float]:
        """Generate vector embedding for a single string."""
        embeddings = self.embed_batch([text])
        return embeddings[0] if embeddings else []

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for a list of strings."""
        if not texts:
            return []

        if not self.client:
            logger.warning("OpenAI API key not configured; returning mock zero-vector embeddings for testing.")
            return [[0.0] * self.dimension for _ in texts]

        try:
            response = self.client.embeddings.create(
                model=self.model,
                input=texts,
                dimensions=self.dimension
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error(f"Error generating OpenAI embeddings: {e}")
            # Fallback mock vectors if API call fails
            return [[0.0] * self.dimension for _ in texts]
