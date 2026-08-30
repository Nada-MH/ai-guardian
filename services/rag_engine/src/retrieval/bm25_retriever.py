import re
from typing import List, Dict, Any
from rank_bm25 import BM25Okapi

class BM25Retriever:
    """Sparse BM25 retriever for exact regulatory clause and keyword matching."""

    def __init__(self, corpus_chunks: List[Dict[str, Any]]):
        self.corpus = corpus_chunks
        self.tokenized_corpus = [
            self._tokenize(chunk.get("content_text") or chunk.get("requirement_text") or "")
            for chunk in corpus_chunks
        ]
        self.bm25 = BM25Okapi(self.tokenized_corpus) if self.tokenized_corpus else None

    def _tokenize(self, text: str) -> List[str]:
        """Simple lower-case alphanumeric tokenization."""
        return re.findall(r"\w+", text.lower())

    def search(self, query: str, top_k: int = 20) -> List[Dict[str, Any]]:
        """Search corpus using BM25 scoring."""
        if not self.bm25 or not self.corpus:
            return []

        tokens = self._tokenize(query)
        if not tokens:
            return []

        scores = self.bm25.get_scores(tokens)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]

        results = []
        for idx in top_indices:
            if scores[idx] > 0:
                chunk_data = self.corpus[idx].copy()
                chunk_data["bm25_score"] = float(scores[idx])
                results.append(chunk_data)

        return results
