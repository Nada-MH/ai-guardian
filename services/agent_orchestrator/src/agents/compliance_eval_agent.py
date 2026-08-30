import json
from typing import Dict, Any, List
from src.agents.base_agent import BaseAgent
from src.prompts.system_prompts import COMPLIANCE_EVALUATION_PROMPT

class ComplianceEvaluationAgent(BaseAgent):
    """
    Agent 5: Evaluates uploaded document evidence against specific regulatory criteria.
    Assigns status (COMPLIANT, PARTIALLY_COMPLIANT, NON_COMPLIANT, INSUFFICIENT_EVIDENCE)
    with exact text citations and confidence scores.
    """

    def __init__(self):
        super().__init__(
            agent_name="ComplianceEvaluationAgent",
            system_prompt=COMPLIANCE_EVALUATION_PROMPT
        )

    def evaluate_criterion(
        self,
        criteria: Dict[str, Any],
        evidence_chunks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Evaluate a single regulatory criterion against retrieved document evidence with provenance validation."""
        provenance = criteria.get("provenance") or {
            "source_id": criteria.get("source_code") or "SRC-UNVERIFIED",
            "framework": criteria.get("source_title") or criteria.get("framework") or "Source verification unavailable",
            "source_type": criteria.get("source_type") or "REGULATORY_GUIDANCE",
            "issuing_organization": criteria.get("publishing_body") or criteria.get("issuing_organization") or "Regulatory Authority",
            "jurisdiction": criteria.get("jurisdiction") or "Saudi Arabia (KSA)",
            "document_version": criteria.get("version") or "1.0",
            "section": criteria.get("article_section"),
            "clause": criteria.get("article_section"),
            "requirement_id": criteria.get("requirement_id") or f"REQ-{criteria.get('id', 'GEN')}",
            "requirement_text": criteria.get("requirement_text"),
            "kb_version": "v1.4.2-provenance"
        }

        user_prompt = json.dumps({
            "target_criterion": {
                "criteria_id": str(criteria.get("id")),
                "regulatory_requirement_id": str(criteria.get("regulatory_requirement_id") or criteria.get("id")),
                "requirement_id": criteria.get("requirement_id") or f"REQ-{criteria.get('article_section', 'GEN')}",
                "article_section": criteria.get("article_section"),
                "title": criteria.get("title"),
                "requirement_text": criteria.get("requirement_text"),
                "weight": float(criteria.get("weight", 1.0)),
                "provenance": provenance
            },
            "evidence_chunks": [
                {
                    "document_id": chunk.get("document_id") or chunk.get("citation_id"),
                    "document_name": chunk.get("document_name") or chunk.get("source_reference", "Uploaded Document"),
                    "page_number": chunk.get("page_number", 1),
                    "section": chunk.get("section"),
                    "text_excerpt": chunk.get("content_text") or chunk.get("text_excerpt")
                }
                for chunk in evidence_chunks
            ]
        })

        result = self.execute(user_prompt)
        
        # Attach IDs and complete 8-point provenance traceability chain to result
        result["criteria_id"] = str(criteria.get("id"))
        result["regulatory_requirement_id"] = str(criteria.get("regulatory_requirement_id") or criteria.get("id"))
        result["provenance_metadata"] = provenance

        # Validate citations: if provenance framework is missing or unverified, flag accordingly
        if not provenance.get("source_id") or provenance.get("source_id") == "SRC-UNVERIFIED":
            for citation in result.get("citations", []):
                if not citation.get("regulation_reference"):
                    citation["regulation_reference"] = "Source verification unavailable"

        return result
