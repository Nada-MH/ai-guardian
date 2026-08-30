"""
AI Guardian — Uncertainty-Aware What-If Compliance Simulator Engine
Calculates projected compliance improvements using the Deterministic Scoring Engine,
evaluates explicit assumption checklists, and models confidence bands.
"""

import sys
import uuid
import logging
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path

# Add database and core paths
DB_MODELS_PATH = Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"
if str(DB_MODELS_PATH) not in sys.path:
    sys.path.insert(0, str(DB_MODELS_PATH))

from models.what_if import ConfidenceLevel, GovernanceMaturityStage
from core.compliance.deterministic_scoring_engine import deterministic_scoring_engine

logger = logging.getLogger("ai_guardian.what_if_engine")

class UncertaintyAwareWhatIfEngine:
    """
    Simulates What-If governance changes with deterministic mathematical modeling,
    explicit assumption tracking, and confidence bands.
    """

    DEFAULT_ASSUMPTIONS = [
        {"id": "asm-human-review", "text": "Mandatory human review is implemented in production queue", "category": "CONTROL", "fulfilled": True, "weight": 25},
        {"id": "asm-scope-coverage", "text": "Review applies to all high-impact loan decision rejections", "category": "SCOPE", "fulfilled": True, "weight": 20},
        {"id": "asm-sop-documented", "text": "Review SOP and escalation path is documented & approved", "category": "POLICY", "fulfilled": True, "weight": 20},
        {"id": "asm-monitoring-active", "text": "Production queue latency monitoring is deployed", "category": "MONITORING", "fulfilled": True, "weight": 20},
        {"id": "asm-evidence-collected", "text": "Cryptographic sign-off logs will be collected for audit", "category": "EVIDENCE", "fulfilled": True, "weight": 15},
    ]

    def simulate_hypothesis(
        self,
        baseline_evaluations: List[Dict[str, Any]],
        baseline_findings: List[Dict[str, Any]],
        proposed_changes: List[str],
        affected_requirement_ids: List[str],
        affected_controls: List[str],
        assumptions: Optional[List[Dict[str, Any]]] = None,
        title: str = "Implement Mandatory Human Review Workflow"
    ) -> Dict[str, Any]:
        """
        Calculates projected score improvement deterministically and evaluates confidence bands.
        """
        active_assumptions = assumptions or self.DEFAULT_ASSUMPTIONS

        # 1. Calculate Baseline Score using Deterministic Scoring Engine
        baseline_calc = deterministic_scoring_engine.calculate_scores(
            evaluations=baseline_evaluations,
            findings=baseline_findings,
            assessment_version="baseline"
        )
        baseline_score = baseline_calc["overall_compliance_score"]

        # 2. Simulate Hypothetical Changes on Evaluation List
        simulated_evaluations = []
        for ev in baseline_evaluations:
            ev_copy = dict(ev)
            if ev_copy.get("requirement_id") in affected_requirement_ids:
                # Simulate transitioning to COMPLIANT with STRONG evidence
                ev_copy["status"] = "COMPLIANT"
                ev_copy["evidence_strength"] = "STRONG"
                ev_copy["confidence"] = 0.98
            simulated_evaluations.append(ev_copy)

        # Simulate resolving affected findings
        simulated_findings = [
            f for f in baseline_findings
            if f.get("requirement_id") not in affected_requirement_ids and f.get("category") != "human_oversight"
        ]

        # 3. Calculate Projected Score Deterministically
        projected_calc = deterministic_scoring_engine.calculate_scores(
            evaluations=simulated_evaluations,
            findings=simulated_findings,
            assessment_version="projected"
        )
        projected_score = projected_calc["overall_compliance_score"]
        estimated_improvement = round(projected_score - baseline_score, 1)

        # 4. Calculate Confidence Band based on Fulfilled Assumptions
        total_weight = sum(a.get("weight", 20) for a in active_assumptions)
        fulfilled_weight = sum(a.get("weight", 20) for a in active_assumptions if a.get("fulfilled", True))
        
        has_monitoring = any(a.get("category") == "MONITORING" and a.get("fulfilled", True) for a in active_assumptions)
        has_control = any(a.get("category") == "CONTROL" and a.get("fulfilled", True) for a in active_assumptions)
        has_policy = any(a.get("category") == "POLICY" and a.get("fulfilled", True) for a in active_assumptions)

        if fulfilled_weight >= 85 and has_monitoring and has_control:
            confidence_level = ConfidenceLevel.HIGH_CONFIDENCE
            confidence_pct = 90.0
            confidence_rationale = "High confidence: Technical control, policy charter, and automated monitoring are all assumed active."
        elif fulfilled_weight >= 60 and has_control:
            confidence_level = ConfidenceLevel.MEDIUM_CONFIDENCE
            confidence_pct = 78.0
            confidence_rationale = "Medium confidence: Core technical control is assumed active, but automated monitoring or audit logs are not verified."
        else:
            confidence_level = ConfidenceLevel.LOW_CONFIDENCE
            confidence_pct = 55.0
            confidence_rationale = "Low confidence: Policy only is assumed; lack of technical controls or monitoring introduces substantial execution risk."

        # 5. Progressive Governance Maturity Stages
        progressive_stages = [
            {
                "stage": "BASELINE",
                "label": "Baseline Assessment",
                "score": baseline_score,
                "delta": 0.0,
                "confidence": "HIGH",
                "confidence_pct": 100.0,
                "description": "Current verified compliance score."
            },
            {
                "stage": "POLICY_ONLY",
                "label": "Implement Policy Charter",
                "score": round(baseline_score + (estimated_improvement * 0.40), 1),
                "delta": round(estimated_improvement * 0.40, 1),
                "confidence": "LOW_CONFIDENCE",
                "confidence_pct": 55.0,
                "description": "Formulate underwriter review charter without automated enforcement."
            },
            {
                "stage": "POLICY_AND_CONTROL",
                "label": "Implement Policy + Queue Control",
                "score": round(baseline_score + (estimated_improvement * 0.73), 1),
                "delta": round(estimated_improvement * 0.73, 1),
                "confidence": "MEDIUM_CONFIDENCE",
                "confidence_pct": 78.0,
                "description": "Deploy message queue to route rejected loans to human underwriters."
            },
            {
                "stage": "POLICY_CONTROL_MONITORING",
                "label": "Implement Policy + Control + Monitoring",
                "score": projected_score,
                "delta": estimated_improvement,
                "confidence": "HIGH_CONFIDENCE",
                "confidence_pct": 90.0,
                "description": "Full closed-loop governance with real-time queue latency monitoring."
            }
        ]

        disclaimer = f"Projected improvement: +{estimated_improvement}% under the stated assumptions. Not a guaranteed outcome."

        return {
            "simulation_id": f"WIF-{str(uuid.uuid4())[:6].upper()}",
            "title": title,
            "proposed_changes": proposed_changes,
            "affected_requirements": affected_requirement_ids,
            "affected_controls": affected_controls,
            "assumptions": active_assumptions,
            "baseline_score": baseline_score,
            "projected_score": projected_score,
            "estimated_improvement": estimated_improvement,
            "confidence_level": confidence_level.value,
            "confidence_pct": confidence_pct,
            "confidence_rationale": confidence_rationale,
            "affected_findings": [f.get("id", "FND-001") for f in baseline_findings if f.get("category") == "human_oversight"],
            "affected_risk_level": {
                "baseline": baseline_calc["overall_risk_level"],
                "projected": projected_calc["overall_risk_level"]
            },
            "progressive_stages": progressive_stages,
            "disclaimer": disclaimer,
            "is_simulated": True
        }

uncertainty_what_if_engine = UncertaintyAwareWhatIfEngine()
