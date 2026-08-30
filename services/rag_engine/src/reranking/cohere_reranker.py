import logging
from typing import List, Dict, Any
from src.config import rag_config

logger = logging.getLogger("ai_guardian.reranker")

class CohereReranker:
    """Re-ranks retrieved candidates using Cohere Cross-Encoder Reranker v3."""

    def __init__(self, api_key: str = None, model: str = rag_config.RERANK_MODEL):
        self.api_key = api_key or rag_config.COHERE_API_KEY
        self.model = model
        self.client = None
        if self.api_key:
            try:
                import cohere
                self.client = cohere.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Cohere client: {e}")

    def rerank(self, query: str, documents: List[Dict[str, Any]], top_n: int = 10) -> List[Dict[str, Any]]:
        """Re-rank document candidates for a query and return Top N above relevance threshold."""
        if not documents:
            return []

        if not self.client:
            logger.info("Cohere API key not set; skipping cross-encoder reranking and returning top candidates as-is.")
            return documents[:top_n]

        try:
            doc_texts = [
                doc.get("content_text") or doc.get("requirement_text") or str(doc)
                for doc in documents
            ]
            response = self.client.rerank(
                query=query,
                documents=doc_texts,
                top_n=top_n,
                model=self.model
            )

            reranked = []
            for result in response.results:
                if result.relevance_score >= rag_config.RERANK_THRESHOLD:
                    item = documents[result.index].copy()
                    item["rerank_score"] = float(result.relevance_score)
                    reranked.append(item)

            return reranked
        except Exception as e:
            logger.error(f"Cohere re-ranking failed: {e}")
            return documents[:top_n]
