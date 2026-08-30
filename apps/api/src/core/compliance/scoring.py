"""Compliance scoring engine: deterministic computation of compliance and risk scores."""
import logging
from typing import List, Dict, Any, Optional
from decimal import Decimal
from .deterministic_scoring_engine import (
    DeterministicScoringEngine,
    deterministic_scoring_engine,
    SCORING_ENGINE_VERSION,
    DEFAULT_CONFIG_VERSION
)

logger = logging.getLogger("ai_guardian.compliance_engine")

# Domain weight distribution (sums to 1.0)
DOMAIN_WEIGHTS: Dict[str, float] = {
    "model_governance": 0.15,
    "bias_fairness": 0.10,
    "explainability": 0.10,
    "data_governance": 0.10,
    "privacy": 0.08,
    "cybersecurity": 0.15,
    "regulatory_compliance": 0.15,
    "risk_management": 0.07,
    "human_oversight": 0.05,
    "third_party_risk": 0.05,
}

# Compliance status multipliers
STATUS_MULTIPLIER = {
    "compliant": 1.0,
    "partially_compliant": 0.5,
    "non_compliant": 0.0,
    "insufficient_evidence": 0.0,
}

def compute_domain_compliance_score(findings: List[dict]) -> float:
    """
    Compute compliance score for a single risk domain.

    Formula: C_d = SUM(w_i * μ_i * γ_i) / SUM(w_i) * 100
    """
    if not findings:
        return 0.0

    weighted_sum = 0.0
    weight_total = 0.0

    for f in findings:
        weight = float(f.get("criteria_weight", 1.0))
        status = f.get("compliance_status", "insufficient_evidence")
        confidence = float(f.get("confidence_score", 1.0))

        mu = STATUS_MULTIPLIER.get(status, 0.0)
        weighted_sum += weight * mu * confidence
        weight_total += weight

    if weight_total == 0:
        return 0.0

    return round((weighted_sum / weight_total) * 100, 2)


def compute_domain_risk_score(compliance_score: float) -> float:
    """Risk score is the inverse of compliance: R_d = 100 - C_d."""
    return round(100.0 - compliance_score, 2)


def classify_risk_level(score: float, has_mandatory_failure: bool = False) -> str:
    """
    Classify risk level from compliance score.

    CRITICAL: OCI < 50 OR any mandatory SAMA criterion failed
    HIGH:     50 <= OCI < 70
    MEDIUM:   70 <= OCI < 85
    LOW:      OCI >= 85
    """
    if has_mandatory_failure or score < 50.0:
        return "critical"
    elif score < 70.0:
        return "high"
    elif score < 85.0:
        return "medium"
    else:
        return "low"


def compute_overall_compliance_index(domain_scores: Dict[str, float]) -> float:
    """
    Compute Overall Compliance Index (OCI) as weighted sum across all domains.

    OCI = SUM(α_d * C_d) where α_d is the domain weight.
    """
    oci = 0.0
    for domain, weight in DOMAIN_WEIGHTS.items():
        domain_score = domain_scores.get(domain, 0.0)
        oci += weight * domain_score

    return round(oci, 2)


def check_mandatory_failures(findings: List[dict]) -> bool:
    """Check if any mandatory (weight >= 2.0) SAMA criteria are non-compliant."""
    for f in findings:
        weight = float(f.get("criteria_weight", 1.0))
        status = f.get("compliance_status", "")
        if weight >= 2.0 and status in ("non_compliant", "insufficient_evidence"):
            return True
    return False
