import logging
from typing import List
from src.config import rag_config

logger = logging.getLogger("ai_guardian.embeddings.local")

class LocalSentenceTransformerEmbedder:
    """
    Generates 100% free local dense vector embeddings using HuggingFace sentence-transformers.
    Default model: 'BAAI/bge-small-en-v1.5' (384d) or 'BAAI/bge-m3' (1024d/1536d padded).
    Runs locally inside Docker on CPU/GPU with $0 API fees.
    """

    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model_name = model_name
        self.model = None
        self._init_model()

    def _init_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading local embedding model: {self.model_name}...")
            self.model = SentenceTransformer(self.model_name)
        except Exception as e:
            logger.warning(f"Could not load sentence-transformers model '{self.model_name}': {e}. Using fallback embedder.")
            self.model = None

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single string."""
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        if not texts:
            return []

        if self.model:
            try:
                embeddings = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
                return embeddings.tolist()
            except Exception as e:
                logger.error(f"Local sentence-transformers embedding failed: {e}")

        # Fallback deterministic zero-padded vector if model loading fails
        dimension = rag_config.EMBEDDING_DIMENSION
        return [[0.0] * dimension for _ in texts]
