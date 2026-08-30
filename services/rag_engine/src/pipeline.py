import logging
from typing import List, Dict, Any, Optional
from src.embeddings.openai_embedder import OpenAIEmbedder
from src.vector_db.qdrant_client import VectorStoreClient
from src.retrieval.bm25_retriever import BM25Retriever
from src.retrieval.hybrid_retriever import reciprocal_rank_fusion
from src.reranking.cohere_reranker import CohereReranker
from src.config import rag_config

logger = logging.getLogger("ai_guardian.rag_pipeline")

class RAGPipeline:
    """End-to-end RAG engine executing Dual-Layer Hybrid Search, RRF, and Citation Tracking."""

    def __init__(self):
        self.embedder = OpenAIEmbedder()
        self.vector_store = VectorStoreClient()
        self.reranker = CohereReranker()

    def rewrite_query(self, query: str, context_type: str = "compliance") -> str:
        """Expand compliance query with domain synonyms (e.g. SAMA MRM, explainability, SHAP)."""
        expansions = {
            "credit": "credit scoring model fairness disparate impact SAMA MRM",
            "fraud": "real-time fraud detection AML alert explainability transaction monitoring",
            "trading": "algorithmic trading model validation risk governance",
            "privacy": "Saudi PDPL personal data consent cross-border transfer",
            "cyber": "SAMA CSF NCA ECC encryption access control API security",
        }
        added_context = ""
        for key, exp in expansions.items():
            if key in query.lower():
                added_context += f" {exp}"
        return (query + added_context).strip()

    def retrieve_context(
        self,
        query: str,
        target_risk_domain: Optional[str] = None,
        organization_id: Optional[str] = None,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Execute end-to-end RAG retrieval across Core Governance & Finance Regulatory layers.
        """
        logger.info(f"RAG Pipeline query: '{query}' | domain: {target_risk_domain}")
        expanded_query = self.rewrite_query(query)

        # 1. Generate query embedding
        query_vector = self.embedder.embed_text(expanded_query)

        # 2. Search Core Governance vector index
        filter_kwargs = {"risk_domain": target_risk_domain} if target_risk_domain else None
        core_dense = self.vector_store.search(
            collection_name=rag_config.CORE_GOVERNANCE_COLLECTION,
            query_vector=query_vector,
            limit=20,
            filter_kwargs=filter_kwargs
        )

        # 3. Search Finance Regulatory vector index
        finance_dense = self.vector_store.search(
            collection_name=rag_config.FINANCE_REGULATORY_COLLECTION,
            query_vector=query_vector,
            limit=20,
            filter_kwargs=filter_kwargs
        )

        dense_candidates = core_dense + finance_dense

        # 4. Perform BM25 Sparse Search (Fallback / Complementary)
        bm25_retriever = BM25Retriever(dense_candidates)
        sparse_candidates = bm25_retriever.search(expanded_query, top_k=20)

        # 5. Execute Reciprocal Rank Fusion (RRF)
        fused_candidates = reciprocal_rank_fusion(dense_candidates, sparse_candidates, top_n=20)

        # 6. Execute Cohere Cross-Encoder Re-ranking
        final_chunks = self.reranker.rerank(expanded_query, fused_candidates, top_n=top_k)

        # 7. Annotate Citation Tracking & Provenance Validation Metadata
        for idx, chunk in enumerate(final_chunks):
            chunk["citation_id"] = f"CIT-{idx+1:02d}"
            provenance = chunk.get("provenance")
            
            if provenance and isinstance(provenance, dict) and provenance.get("source_id"):
                chunk["citation_reference"] = f"{provenance.get('framework', chunk.get('source_code'))} {provenance.get('clause', chunk.get('article_section'))}"
                chunk["provenance_status"] = "VERIFIED"
            else:
                chunk["citation_reference"] = "Source verification unavailable"
                chunk["provenance_status"] = "UNVERIFIED"

        return final_chunks
