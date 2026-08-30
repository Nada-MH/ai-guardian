"""
AI Guardian — Governance Gap Analysis & Prioritization Engine
Models regulatory compliance across 4 discrete layers:
Regulation -> Internal Policy -> Implementation Control -> Evidence
"""

import sys
import re
import logging
from typing import Dict, Any, List, Optional, Tuple, Union
from pathlib import Path

# Add database models path
DB_MODELS_PATH = Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"
if str(DB_MODELS_PATH) not in sys.path:
    sys.path.insert(0, str(DB_MODELS_PATH))

from models.gap_analysis import LayerState, OverallGapStatus

logger = logging.getLogger("ai_guardian.gap_engine")

class GovernanceGapEngine:
    """
    Evaluates where the governance chain breaks across the 4 canonical layers
    and produces a prioritized remediation ranking.
    """

    SEVERITY_WEIGHTS = {
        "CRITICAL": 40.0,
        "HIGH": 30.0,
        "MEDIUM": 20.0,
        "LOW": 10.0
    }

    LAYER_BREAK_WEIGHTS = {
        "POLICY": 30.0,    # Governance charter failure
        "CONTROL": 20.0,   # Operational failure
        "EVIDENCE": 15.0,  # Evidentiary verification failure
        "NONE": 0.0        # Fully covered
    }

    def evaluate_requirement_layers(
        self,
        requirement: Dict[str, Any],
        matched_policies: Optional[List[Dict[str, Any]]] = None,
        matched_controls: Optional[List[Dict[str, Any]]] = None,
        matched_evidence: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Determines the discrete state (PRESENT, PARTIAL, MISSING, UNKNOWN) for each of the 4 layers.
        Enforces guardrail: Never claim policy coverage unless substantiated evidence or policy text exists.
        """
        req_id = requirement.get("requirement_id", "REQ-UNKNOWN")
        framework = requirement.get("framework", "")
        clause = requirement.get("clause", "")
        category = requirement.get("category", "governance")
        severity = requirement.get("severity", "HIGH").upper()

        # 1. Regulation Layer (Always PRESENT for in-scope active rules)
        regulation_state = LayerState.PRESENT
        regulation_details = {
            "source_id": requirement.get("source_id", "SRC-CATALOG"),
            "framework": framework,
            "clause": clause,
            "legal_obligation": requirement.get("requirement_text", "Regulatory mandate applicable in jurisdiction."),
            "jurisdiction": requirement.get("jurisdiction", "Saudi Arabia (KSA)"),
            "provenance_hash": requirement.get("document_hash")
        }

        # 2. Internal Policy Layer
        policy_state = LayerState.MISSING
        policy_details = None
        if matched_policies and len(matched_policies) > 0:
            top_pol = matched_policies[0]
            confidence = top_pol.get("confidence", 0.9)
            if confidence >= 0.85 and top_pol.get("policy_text"):
                policy_state = LayerState.PRESENT
            elif confidence >= 0.50:
                policy_state = LayerState.PARTIAL
            else:
                policy_state = LayerState.MISSING

            policy_details = {
                "policy_document": top_pol.get("document_name", "Enterprise Policy Manual"),
                "section": top_pol.get("section", "Section 1.0"),
                "policy_text": top_pol.get("policy_text", ""),
                "confidence": confidence,
                "status": policy_state.value
            }

        # 3. Implementation Control Layer
        control_state = LayerState.MISSING
        control_details = None
        if matched_controls and len(matched_controls) > 0:
            top_ctrl = matched_controls[0]
            c_status = top_ctrl.get("status", "OPERATIONAL")
            if c_status in ["OPERATIONAL", "IMPLEMENTED", "ACTIVE"]:
                control_state = LayerState.PRESENT
            elif c_status in ["IN_PROGRESS", "DESIGNED", "PARTIAL"]:
                control_state = LayerState.PARTIAL
            else:
                control_state = LayerState.MISSING

            control_details = {
                "control_id": top_ctrl.get("control_id", "CTRL-001"),
                "control_name": top_ctrl.get("control_name", "Operational Control Spec"),
                "implementation_mechanism": top_ctrl.get("mechanism", "Automated Workflow / System Rule"),
                "status": control_state.value
            }

        # 4. Evidence Layer
        evidence_state = LayerState.MISSING
        evidence_details = None
        if matched_evidence and len(matched_evidence) > 0:
            top_evid = matched_evidence[0]
            ev_strength = top_evid.get("evidence_strength", "STRONG")
            if ev_strength == "STRONG" and top_evid.get("excerpt"):
                evidence_state = LayerState.PRESENT
            elif ev_strength in ["MODERATE", "PARTIAL"]:
                evidence_state = LayerState.PARTIAL
            else:
                evidence_state = LayerState.MISSING

            evidence_details = {
                "evidence_id": top_evid.get("evidence_id", "EVID-001"),
                "document_name": top_evid.get("document_name", "Uploaded Audit Artifact"),
                "location": top_evid.get("location", "Page 1"),
                "excerpt": top_evid.get("excerpt", "Audit verification text"),
                "status": evidence_state.value
            }

        # Determine Overall Gap Status and Where the Governance Chain Broke
        overall_gap_status, broken_layer = self.classify_overall_gap(
            regulation_state=regulation_state,
            policy_state=policy_state,
            control_state=control_state,
            evidence_state=evidence_state,
            severity=severity
        )

        # Compute Prioritization Score (0-100)
        prio_score = self.calculate_prioritization_score(
            severity=severity,
            broken_layer=broken_layer,
            is_production=requirement.get("is_production", True),
            is_high_impact=requirement.get("is_high_impact", True)
        )

        return {
            "requirement_id": req_id,
            "framework": framework,
            "clause": clause,
            "category": category,
            "severity": severity,
            "regulation_state": regulation_state.value,
            "policy_state": policy_state.value,
            "control_state": control_state.value,
            "evidence_state": evidence_state.value,
            "overall_gap_status": overall_gap_status.value,
            "broken_layer": broken_layer,
            "prioritization_score": prio_score,
            "regulation_details": regulation_details,
            "policy_details": policy_details,
            "control_details": control_details,
            "evidence_details": evidence_details,
            "remediation_action": requirement.get("remediation_action", f"Address governance gap at {broken_layer} layer.")
        }

    def classify_overall_gap(
        self,
        regulation_state: LayerState,
        policy_state: LayerState,
        control_state: LayerState,
        evidence_state: LayerState,
        severity: str
    ) -> Tuple[OverallGapStatus, str]:
        """Classifies the overall gap state and pinpoints the broken layer."""
        if (
            regulation_state == LayerState.PRESENT
            and policy_state == LayerState.PRESENT
            and control_state == LayerState.PRESENT
            and evidence_state == LayerState.PRESENT
        ):
            return OverallGapStatus.COVERED, "NONE"

        # Check where chain breaks chronologically:
        if policy_state in [LayerState.MISSING, LayerState.UNKNOWN]:
            if severity == "CRITICAL":
                return OverallGapStatus.CRITICAL_GAP, "POLICY"
            elif severity == "HIGH":
                return OverallGapStatus.MAJOR_GAP, "POLICY"
            return OverallGapStatus.POLICY_GAP, "POLICY"

        if control_state in [LayerState.MISSING, LayerState.UNKNOWN]:
            return OverallGapStatus.CONTROL_GAP, "CONTROL"

        if evidence_state in [LayerState.MISSING, LayerState.UNKNOWN]:
            return OverallGapStatus.EVIDENCE_GAP, "EVIDENCE"

        # Any partial states
        return OverallGapStatus.PARTIAL_COVERAGE, "PARTIAL_REVIEWS"

    def calculate_prioritization_score(
        self,
        severity: str,
        broken_layer: str,
        is_production: bool = True,
        is_high_impact: bool = True
    ) -> float:
        """
        Calculates normalized Prioritization Score (0 - 100):
        Score = BaseSeverity + LayerBreakPenalty + ProductionImpact
        """
        if broken_layer == "NONE":
            return 0.0

        base_sev = self.SEVERITY_WEIGHTS.get(severity, 20.0)
        layer_pen = self.LAYER_BREAK_WEIGHTS.get(broken_layer, 10.0)
        impact_bonus = 0.0
        if is_production:
            impact_bonus += 15.0
        if is_high_impact:
            impact_bonus += 15.0

        total = min(100.0, max(0.0, base_sev + layer_pen + impact_bonus))
        return round(total, 2)

    def generate_matrix(self, evaluated_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Processes a collection of evaluated requirements and produces the full matrix
        with sorted prioritization ranks.
        """
        sorted_items = sorted(
            evaluated_items,
            key=lambda x: x.get("prioritization_score", 0.0),
            reverse=True
        )

        for rank, item in enumerate(sorted_items, 1):
            item["priority_rank"] = rank

        total = len(sorted_items)
        covered_count = sum(1 for i in sorted_items if i.get("overall_gap_status") == "COVERED")
        evidence_gap_count = sum(1 for i in sorted_items if i.get("overall_gap_status") == "EVIDENCE_GAP")
        control_gap_count = sum(1 for i in sorted_items if i.get("overall_gap_status") == "CONTROL_GAP")
        policy_gap_count = sum(1 for i in sorted_items if i.get("overall_gap_status") in ["POLICY_GAP", "CRITICAL_GAP", "MAJOR_GAP"])
        partial_count = sum(1 for i in sorted_items if i.get("overall_gap_status") == "PARTIAL_COVERAGE")

        return {
            "total_requirements": total,
            "metrics": {
                "covered_count": covered_count,
                "evidence_gap_count": evidence_gap_count,
                "control_gap_count": control_gap_count,
                "policy_gap_count": policy_gap_count,
                "partial_count": partial_count,
                "coverage_ratio": round(covered_count / total if total > 0 else 0.0, 3)
            },
            "matrix": sorted_items
        }


governance_gap_engine = GovernanceGapEngine()
