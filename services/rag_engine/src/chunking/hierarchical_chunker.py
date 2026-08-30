import re
from typing import List, Dict, Any
from src.config import rag_config

class HierarchicalChunker:
    """
    Implements Parent-Child & Semantic Clause Chunking Strategy.
    - Parent Chunk (~1500 tokens): Preserves full context window.
    - Child Chunk (~300 tokens): Used for dense vector similarity search.
    """

    def __init__(
        self,
        parent_size: int = rag_config.PARENT_CHUNK_SIZE,
        child_size: int = rag_config.CHILD_CHUNK_SIZE,
        overlap: int = rag_config.CHUNK_OVERLAP,
    ):
        self.parent_size = parent_size
        self.child_size = child_size
        self.overlap = overlap

    def chunk_section(self, section_text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Splits a section into hierarchical Parent-Child chunks."""
        if not section_text:
            return []

        # Parent chunking (sliding window by character length approximation ~4 chars per token)
        parent_char_size = self.parent_size * 4
        child_char_size = self.child_size * 4
        overlap_char_size = self.overlap * 4

        parent_chunks = []
        start = 0
        while start < len(section_text):
            end = min(start + parent_char_size, len(section_text))
            parent_text = section_text[start:end].strip()
            if parent_text:
                parent_id = f"pchk-{hash(parent_text) & 0xFFFFFFFF:08x}"
                parent_chunks.append({
                    "parent_id": parent_id,
                    "text": parent_text,
                })
            start += parent_char_size - overlap_char_size

        all_child_chunks = []
        for p_idx, parent in enumerate(parent_chunks):
            p_text = parent["text"]

            # Splitting delimiters for child chunks (Clause Regex first, then Paragraphs)
            clauses = re.split(r"\n(?=Clause\s+\d+|Article\s+\d+|Control\s+[\w\-\.]+|Section\s+\d+)", p_text)
            
            c_idx = 0
            for clause_block in clauses:
                clause_text = clause_block.strip()
                if not clause_text:
                    continue

                # Sub-chunk if clause exceeds child_size
                if len(clause_text) <= child_char_size:
                    all_child_chunks.append(self._build_child_chunk(
                        child_text=clause_text,
                        parent_id=parent["parent_id"],
                        chunk_index=c_idx,
                        metadata=metadata
                    ))
                    c_idx += 1
                else:
                    sub_start = 0
                    while sub_start < len(clause_text):
                        sub_end = min(sub_start + child_char_size, len(clause_text))
                        sub_text = clause_text[sub_start:sub_end].strip()
                        if sub_text:
                            all_child_chunks.append(self._build_child_chunk(
                                child_text=sub_text,
                                parent_id=parent["parent_id"],
                                chunk_index=c_idx,
                                metadata=metadata
                            ))
                            c_idx += 1
                        sub_start += child_char_size - overlap_char_size

        return all_child_chunks

    def _build_child_chunk(self, child_text: str, parent_id: str, chunk_index: int, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Construct child chunk metadata payload."""
        chunk_id = f"chk-{hash(child_text + str(chunk_index)) & 0xFFFFFFFF:08x}"
        payload = metadata.copy()
        payload.update({
            "chunk_id": chunk_id,
            "parent_chunk_id": parent_id,
            "content_text": child_text,
            "char_count": len(child_text),
            "estimated_token_count": len(child_text) // 4,
        })
        return payload
