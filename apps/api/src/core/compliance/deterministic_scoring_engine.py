"""
AI Guardian — Deterministic Compliance Scoring Engine.
Calculates mathematical compliance scores, explicit severity penalties, and reproducible snapshots.
The LLM evaluates evidence and assigns states; this engine computes all scores purely mathematically.
"""

import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

SCORING_ENGINE_VERSION = "v1.0.0-deterministic"
DEFAULT_CONFIG_VERSION = "v2026.1-standard"

# Default category weightings (Sum = 1.0)
DEFAULT_CATEGORY_WEIGHTS: Dict[str, float] = {
    "privacy": 0.20,
    "security": 0.15,
    "fairness": 0.15,
    "transparency": 0.15,
    "human_oversight": 0.15,
    "governance": 0.10,
    "monitoring": 0.10,
}

# Primary compliance state satisfaction multipliers
STATE_MULTIPLIERS = {
    "COMPLIANT": 1.0,
    "PARTIALLY_COMPLIANT": 0.5,
    "INSUFFICIENT_EVIDENCE": 0.0,  # Distinct state; never penalized as proven violation
    "NON_COMPLIANT": 0.0,
    "NOT_APPLICABLE": None,        # Excluded from calculation
}

# Explicit deterministic penalty deduction constants (points per item)
SEVERITY_PENALTIES = {
    "CRITICAL": 5.0,
    "HIGH": 3.0,
    "MEDIUM": 1.5,
    "LOW": 0.5,
    "MISSING_EVIDENCE": 1.0,       # Explicit missing evidence penalty (distinct from violation)
}

MAX_CATEGORY_PENALTY = 35.0  # Max penalty cap per domain to prevent negative runaway

@dataclass
class ScoringConfiguration:
    version: str = DEFAULT_CONFIG_VERSION
    category_weights: Dict[str, float] = field(default_factory=lambda: dict(DEFAULT_CATEGORY_WEIGHTS))
    state_multipliers: Dict[str, float] = field(default_factory=lambda: dict(STATE_MULTIPLIERS))
    severity_penalties: Dict[str, float] = field(default_factory=lambda: dict(SEVERITY_PENALTIES))
    max_penalty_cap: float = MAX_CATEGORY_PENALTY

class DeterministicScoringEngine:
    """
    Pure mathematical scoring engine with 100% deterministic reproducibility.
    Computes category scores, penalty deductions, and cryptographic input hashes.
    """

    def __init__(self, config: Optional[ScoringConfiguration] = None):
        self.config = config or ScoringConfiguration()

    def calculate_scores(
        self,
        evaluations: List[Dict[str, Any]],
        findings: Optional[List[Dict[str, Any]]] = None,
        assessment_version: str = "v1"
    ) -> Dict[str, Any]:
        """
        Executes the deterministic scoring pipeline:
        1. Filters out NOT_APPLICABLE requirements.
        2. Computes weighted Raw Category Scores.
        3. Computes explicit deterministic severity & missing evidence penalties.
        4. Computes Adjusted Category Scores.
        5. Computes Overall Compliance Score.
        6. Computes cryptographic SHA-256 reproducibility hash.
        """
        findings = findings or []
        timestamp = datetime.now(timezone.utc).isoformat()

        # Group evaluations by category (normalizing domain names)
        category_evals: Dict[str, List[Dict[str, Any]]] = {cat: [] for cat in self.config.category_weights}
        category_findings: Dict[str, List[Dict[str, Any]]] = {cat: [] for cat in self.config.category_weights}

        excluded_not_applicable = 0
        applicable_count = 0
        insufficient_evidence_count = 0
        non_compliant_count = 0
        compliant_count = 0
        partially_compliant_count = 0

        for item in evaluations:
            raw_cat = str(item.get("category") or item.get("risk_domain") or "governance").lower()
            cat = self._normalize_category(raw_cat)
            status = str(item.get("status") or item.get("compliance_status") or "INSUFFICIENT_EVIDENCE").upper()

            if status == "NOT_APPLICABLE":
                excluded_not_applicable += 1
                continue

            applicable_count += 1
            if status == "COMPLIANT":
                compliant_count += 1
            elif status == "PARTIALLY_COMPLIANT":
                partially_compliant_count += 1
            elif status == "NON_COMPLIANT":
                non_compliant_count += 1
            elif status == "INSUFFICIENT_EVIDENCE":
                insufficient_evidence_count += 1

            if cat in category_evals:
                category_evals[cat].append(item)
            else:
                category_evals["governance"].append(item)

        for finding in findings:
            raw_cat = str(finding.get("category") or finding.get("risk_domain") or "governance").lower()
            cat = self._normalize_category(raw_cat)
            if cat in category_findings:
                category_findings[cat].append(finding)
            else:
                category_findings["governance"].append(finding)

        # ----------------------------------------------------
        # COMPUTE CATEGORY SCORES & PENALTIES
        # ----------------------------------------------------
        category_scores_detail: Dict[str, Dict[str, Any]] = {}
        penalty_deduction_log: List[Dict[str, Any]] = []
        weighted_overall_sum = 0.0
        total_category_weight = 0.0
        has_mandatory_critical_failure = False

        for cat, weight in self.config.category_weights.items():
            evals = category_evals.get(cat, [])
            cat_findings = category_findings.get(cat, [])

            if not evals:
                raw_score = 100.0  # If no applicable rules in domain, default neutral
                raw_weighted_sum = 0.0
                raw_weight_total = 0.0
            else:
                raw_weighted_sum = 0.0
                raw_weight_total = 0.0

                for ev in evals:
                    w = float(ev.get("weight") or ev.get("criteria_weight") or 1.0)
                    status = str(ev.get("status") or ev.get("compliance_status") or "INSUFFICIENT_EVIDENCE").upper()
                    conf = float(ev.get("confidence") or ev.get("confidence_score") or 1.0)
                    mu = self.config.state_multipliers.get(status, 0.0)

                    if mu is not None:
                        raw_weighted_sum += (w * mu * conf)
                        raw_weight_total += w

                    if w >= 2.0 and status in ("NON_COMPLIANT", "INSUFFICIENT_EVIDENCE"):
                        has_mandatory_critical_failure = True

                raw_score = round((raw_weighted_sum / raw_weight_total) * 100, 2) if raw_weight_total > 0 else 100.0

            # Count violations by severity in this category
            crit_count = sum(1 for f in cat_findings if str(f.get("severity", "")).upper() == "CRITICAL")
            high_count = sum(1 for f in cat_findings if str(f.get("severity", "")).upper() == "HIGH")
            med_count = sum(1 for f in cat_findings if str(f.get("severity", "")).upper() == "MEDIUM")
            low_count = sum(1 for f in cat_findings if str(f.get("severity", "")).upper() == "LOW")
            missing_evidence_in_cat = sum(1 for ev in evals if str(ev.get("status")).upper() == "INSUFFICIENT_EVIDENCE")

            # Deterministic Penalty Formula
            crit_pen = crit_count * self.config.severity_penalties["CRITICAL"]
            high_pen = high_count * self.config.severity_penalties["HIGH"]
            med_pen = med_count * self.config.severity_penalties["MEDIUM"]
            low_pen = low_count * self.config.severity_penalties["LOW"]
            missing_pen = missing_evidence_in_cat * self.config.severity_penalties["MISSING_EVIDENCE"]

            total_cat_penalty = min(
                self.config.max_penalty_cap,
                round(crit_pen + high_pen + med_pen + low_pen + missing_pen, 2)
            )

            adjusted_score = max(0.0, min(100.0, round(raw_score - total_cat_penalty, 2)))

            category_scores_detail[cat] = {
                "category": cat,
                "weight": weight,
                "raw_score": raw_score,
                "adjusted_score": adjusted_score,
                "penalty_deduction": total_cat_penalty,
                "total_applicable_requirements": len(evals),
                "compliant_count": sum(1 for ev in evals if str(ev.get("status")).upper() == "COMPLIANT"),
                "partially_compliant_count": sum(1 for ev in evals if str(ev.get("status")).upper() == "PARTIALLY_COMPLIANT"),
                "non_compliant_count": sum(1 for ev in evals if str(ev.get("status")).upper() == "NON_COMPLIANT"),
                "insufficient_evidence_count": missing_evidence_in_cat,
                "violations_breakdown": {
                    "critical": crit_count,
                    "high": high_count,
                    "medium": med_count,
                    "low": low_count
                }
            }

            if total_cat_penalty > 0:
                penalty_deduction_log.append({
                    "category": cat,
                    "penalty_points": total_cat_penalty,
                    "formula": f"{crit_count}x5.0 (Crit) + {high_count}x3.0 (High) + {med_count}x1.5 (Med) + {missing_evidence_in_cat}x1.0 (Missing)",
                    "capped": total_cat_penalty == self.config.max_penalty_cap
                })

            weighted_overall_sum += (adjusted_score * weight)
            total_category_weight += weight

        # ----------------------------------------------------
        # COMPUTE OVERALL COMPLIANCE SCORE & RISK LEVEL
        # ----------------------------------------------------
        overall_compliance_score = round(weighted_overall_sum / total_category_weight, 2) if total_category_weight > 0 else 0.0

        if has_mandatory_critical_failure or overall_compliance_score < 50.0:
            overall_risk_level = "CRITICAL"
        elif overall_compliance_score < 70.0:
            overall_risk_level = "HIGH"
        elif overall_compliance_score < 85.0:
            overall_risk_level = "MEDIUM"
        else:
            overall_risk_level = "LOW"

        # ----------------------------------------------------
        # COMPUTE CRYPTOGRAPHIC REPRODUCIBILITY INPUT HASH
        # ----------------------------------------------------
        sorted_inputs = sorted(
            [
                {
                    "id": str(e.get("requirement_id") or e.get("id")),
                    "status": str(e.get("status") or e.get("compliance_status")),
                    "weight": float(e.get("weight") or 1.0),
                    "confidence": float(e.get("confidence") or 1.0)
                }
                for e in evaluations
            ],
            key=lambda x: x["id"]
        )
        hash_payload = {
            "inputs": sorted_inputs,
            "config_version": self.config.version,
            "engine_version": SCORING_ENGINE_VERSION
        }
        input_hash = hashlib.sha256(json.dumps(hash_payload, sort_keys=True).encode("utf-8")).hexdigest()

        return {
            "overall_compliance_score": overall_compliance_score,
            "overall_risk_level": overall_risk_level,
            "scoring_engine_version": SCORING_ENGINE_VERSION,
            "scoring_configuration_version": self.config.version,
            "assessment_version": assessment_version,
            "calculation_timestamp": timestamp,
            "input_hash": input_hash,
            "has_mandatory_critical_failure": has_mandatory_critical_failure,
            "metrics": {
                "total_evaluated": len(evaluations),
                "applicable_count": applicable_count,
                "excluded_not_applicable": excluded_not_applicable,
                "compliant_count": compliant_count,
                "partially_compliant_count": partially_compliant_count,
                "non_compliant_count": non_compliant_count,
                "insufficient_evidence_count": insufficient_evidence_count,
            },
            "category_scores": category_scores_detail,
            "penalties_applied": penalty_deduction_log,
            "mathematical_proof": {
                "formula": "Overall Compliance Score = SUM(Category_Weight_c * Adjusted_Category_Score_c) / SUM(Category_Weight_c)",
                "raw_category_formula": "Raw_Category_Score_c = SUM(w_r * mu_r * conf_r) / SUM(w_r) * 100",
                "penalty_formula": "Penalty_c = MIN(35.0, 5.0*N_crit + 3.0*N_high + 1.5*N_med + 0.5*N_low + 1.0*N_missing)",
                "adjusted_category_formula": "Adjusted_Category_Score_c = MAX(0.0, MIN(100.0, Raw_Category_Score_c - Penalty_c))"
            }
        }

    def _normalize_category(self, raw_category: str) -> str:
        """Normalizes risk domain and criteria strings to the 7 canonical categories."""
        c = raw_category.lower()
        if "privac" in c or "pdpl" in c:
            return "privacy"
        elif "secur" in c or "cyber" in c or "nca" in c or "csf" in c:
            return "security"
        elif "fair" in c or "bias" in c or "disparate" in c:
            return "fairness"
        elif "transpar" in c or "explain" in c or "shap" in c or "lime" in c:
            return "transparency"
        elif "oversight" in c or "human" in c or "intervention" in c:
            return "human_oversight"
        elif "monitor" in c or "drift" in c or "accuracy" in c:
            return "monitoring"
        else:
            return "governance"

# Global singleton
deterministic_scoring_engine = DeterministicScoringEngine()
