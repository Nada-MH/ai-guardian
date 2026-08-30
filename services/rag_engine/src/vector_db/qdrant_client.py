import logging
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient as RawQdrantClient
from qdrant_client.http import models as qmodels
from src.config import rag_config

logger = logging.getLogger("ai_guardian.vector_db")

class VectorStoreClient:
    """Manages Qdrant vector database collections, payload indexing, and similarity search."""

    def __init__(self, url: str = rag_config.QDRANT_URL, api_key: str = rag_config.QDRANT_API_KEY):
        self.url = url
        self.api_key = api_key
        try:
            self.client = RawQdrantClient(url=self.url, api_key=self.api_key)
        except Exception as e:
            logger.warning(f"Could not connect to Qdrant at {url}: {e}")
            self.client = None

    def init_collections(self):
        """Initialize core governance, finance regulatory, and uploaded docs collections in Qdrant."""
        if not self.client:
            return

        collections = [
            rag_config.CORE_GOVERNANCE_COLLECTION,
            rag_config.FINANCE_REGULATORY_COLLECTION,
            rag_config.UPLOADED_DOCS_COLLECTION,
        ]

        for col in collections:
            try:
                if not self.client.collection_exists(col):
                    self.client.create_collection(
                        collection_name=col,
                        vectors_config=qmodels.VectorParams(
                            size=rag_config.EMBEDDING_DIMENSION,
                            distance=qmodels.Distance.COSINE
                        )
                    )
                    # Create payload indexes for fast filtering
                    self.client.create_payload_index(col, field_name="source_code", field_schema=qmodels.PayloadSchemaType.KEYWORD)
                    self.client.create_payload_index(col, field_name="risk_domain", field_schema=qmodels.PayloadSchemaType.KEYWORD)
                    self.client.create_payload_index(col, field_name="organization_id", field_schema=qmodels.PayloadSchemaType.KEYWORD)
                    logger.info(f"Created Qdrant collection: {col}")
            except Exception as e:
                logger.error(f"Failed to create Qdrant collection {col}: {e}")

    def upsert_chunks(self, collection_name: str, points: List[Dict[str, Any]]):
        """Upsert chunk points with vector embeddings and metadata payload."""
        if not self.client or not points:
            return

        qpoints = [
            qmodels.PointStruct(
                id=pt.get("id") or pt.get("chunk_id"),
                vector=pt["vector"],
                payload=pt["payload"]
            )
            for pt in points
        ]
        self.client.upsert(collection_name=collection_name, points=qpoints)

    def search(
        self,
        collection_name: str,
        query_vector: List[float],
        limit: int = 10,
        filter_kwargs: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Execute HNSW dense vector similarity search with payload filtering."""
        if not self.client:
            return []

        qfilter = None
        if filter_kwargs:
            must_conditions = [
                qmodels.FieldCondition(key=k, match=qmodels.MatchValue(value=v))
                for k, v in filter_kwargs.items() if v is not None
            ]
            if must_conditions:
                qfilter = qmodels.Filter(must=must_conditions)

        try:
            results = self.client.search(
                collection_name=collection_name,
                query_vector=query_vector,
                query_filter=qfilter,
                limit=limit,
            )
            return [
                {
                    "id": hit.id,
                    "score": hit.score,
                    "payload": hit.payload
                }
                for hit in results
            ]
        except Exception as e:
            logger.error(f"Qdrant vector search failed in collection {collection_name}: {e}")
            return []
