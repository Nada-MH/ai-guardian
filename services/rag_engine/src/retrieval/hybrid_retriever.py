from typing import List, Dict, Any

def reciprocal_rank_fusion(
    dense_results: List[Dict[str, Any]],
    sparse_results: List[Dict[str, Any]],
    k: int = 60,
    top_n: int = 20
) -> List[Dict[str, Any]]:
    """
    Combines dense and sparse search rankings using Reciprocal Rank Fusion (RRF).
    RRF Score(d) = SUM_m ( 1 / (k + rank_m(d)) )
    """
    rrf_scores: Dict[str, float] = {}
    chunk_map: Dict[str, Dict[str, Any]] = {}

    # Process Dense Results
    for rank, hit in enumerate(dense_results):
        cid = str(hit.get("id") or hit.get("chunk_id") or hit.get("payload", {}).get("chunk_id"))
        chunk_map[cid] = hit.get("payload") or hit
        rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (k + (rank + 1)))

    # Process Sparse BM25 Results
    for rank, hit in enumerate(sparse_results):
        cid = str(hit.get("id") or hit.get("chunk_id") or hit.get("payload", {}).get("chunk_id"))
        if cid not in chunk_map:
            chunk_map[cid] = hit.get("payload") or hit
        rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (k + (rank + 1)))

    # Sort chunks by final RRF score descending
    sorted_cids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)[:top_n]

    fused_results = []
    for cid in sorted_cids:
        chunk = chunk_map[cid].copy()
        chunk["rrf_score"] = round(rrf_scores[cid], 6)
        fused_results.append(chunk)

    return fused_results
