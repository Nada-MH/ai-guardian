"""
AI Guardian — Gap Analysis API Router
Provides REST endpoints for querying the 4-layer Governance Gap Matrix,
inspecting layer cell drilldowns, and prioritizing remediation.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel

from src.core.gap_analysis.gap_engine import governance_gap_engine

router = APIRouter()

@router.get("/matrix", summary="Get 4-Layer Governance Gap Matrix")
async def get_gap_matrix(
    project_id: Optional[str] = Query(None, description="Filter by AI project ID"),
    category: Optional[str] = Query(None, description="Filter by category (privacy, security, fairness, etc.)"),
    gap_status: Optional[str] = Query(None, description="Filter by gap status (COVERED, EVIDENCE_GAP, CONTROL_GAP, CRITICAL_GAP)")
):
    """
    Returns the 4-layer Governance Gap Matrix for in-scope requirements:
    Regulation -> Internal Policy -> Implementation Control -> Evidence
    """
    # Sample evaluation pool
    sample_evaluations = [
        governance_gap_engine.evaluate_requirement_layers(
            requirement={
                "requirement_id": "REQ-SAMA-AI-5.3",
                "framework": "SAMA AI and Technology Guidance for Banks",
                "clause": "Clause 5.3: Mandatory Human Intervention",
                "category": "human_oversight",
                "severity": "CRITICAL"
            },
            matched_policies=[{"document_name": "Human_Underwriting_SOP_v2.pdf", "section": "Sec 2.1", "policy_text": "Mandatory human review queue operational for credit denials.", "confidence": 0.95}],
            matched_controls=[{"control_id": "CTRL-HITL-01", "control_name": "Underwriter Escalation Queue", "status": "OPERATIONAL"}],
            matched_evidence=[{"evidence_id": "EVID-SOP-01", "document_name": "Human_Underwriting_SOP_v2.pdf", "excerpt": "Attested manual underwriter queue log.", "evidence_strength": "STRONG"}]
        ),
        governance_gap_engine.evaluate_requirement_layers(
            requirement={
                "requirement_id": "REQ-SAUDI-PDPL-13",
                "framework": "Saudi Personal Data Protection Law (PDPL)",
                "clause": "Article 13: Data Retention & Destruction",
                "category": "privacy",
                "severity": "HIGH"
            },
            matched_policies=[{"document_name": "Data_Destruction_Lifecycle_Policy_2026.pdf", "section": "Sec 5", "policy_text": "All inference records purged after 7-year statutory period.", "confidence": 0.98}],
            matched_controls=[{"control_id": "CTRL-PURGE-01", "control_name": "PostgreSQL 7-Year Cron Purge", "status": "OPERATIONAL"}],
            matched_evidence=[{"evidence_id": "EVID-PURGE-LOG", "document_name": "Data_Destruction_Lifecycle_Policy_2026.pdf", "excerpt": "Cron job deletion logs with SHA-256.", "evidence_strength": "STRONG"}]
        ),
        governance_gap_engine.evaluate_requirement_layers(
            requirement={
                "requirement_id": "REQ-SDAIA-ETHICS-1.2",
                "framework": "SDAIA AI Ethics Principles",
                "clause": "Principle 1.2: Demographic Parity & Fairness",
                "category": "fairness",
                "severity": "HIGH"
            },
            matched_policies=[{"document_name": "Model_Governance_Charter.pdf", "section": "Sec 3.1", "policy_text": "Fairness assessment required for credit scoring.", "confidence": 0.75}],
            matched_controls=[{"control_id": "CTRL-DEBIAS-01", "control_name": "Adversarial Debiasing Pipeline", "status": "IN_PROGRESS"}],
            matched_evidence=[{"evidence_id": "EVID-DEBIAS-01", "document_name": "Model_Debiasing_Audit_Report_v2.pdf", "excerpt": "Disparate impact ratio 0.84 (Target: 0.90).", "evidence_strength": "MODERATE"}]
        ),
        governance_gap_engine.evaluate_requirement_layers(
            requirement={
                "requirement_id": "REQ-NDMO-DATA-4.3",
                "framework": "NDMO National Data Governance Interim Regulations",
                "clause": "Article 4.3: Third-Party Cloud Data Sharing",
                "category": "governance",
                "severity": "HIGH"
            },
            matched_policies=[{"document_name": "Internal_Data_Classification_Spec.pdf", "section": "Sec 5", "policy_text": "On-premise processing mandate.", "confidence": 0.90}],
            matched_controls=[], # Control Missing
            matched_evidence=[]  # Evidence Missing
        )
    ]

    result = governance_gap_engine.generate_matrix(sample_evaluations)
    return result
