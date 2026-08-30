"""
Deterministic Regulatory Applicability & Classification Engine for AI Guardian.
Filters knowledge base requirements based on the 14 operational dimensions of the AI System Profile.
"""

from typing import Dict, Any, List, Optional
import re
from datetime import datetime

class RegulatoryApplicabilityEngine:
    """
    Evaluates regulatory requirements deterministically against an Assessment Profile
    to determine which requirements apply and why, and which are excluded and why.
    """

    def __init__(self):
        pass

    def evaluate_applicability(
        self,
        profile: Dict[str, Any],
        requirements: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Executes the 6-stage applicability pipeline.
        Returns full applicability matrix with reasons for each requirement.
        """
        jurisdiction = profile.get("jurisdiction", "Saudi Arabia (KSA)")
        sector = profile.get("sector", "Banking & Finance")
        org_type = profile.get("organization_type", "Commercial Bank")
        ai_use_case = profile.get("ai_use_case", "Credit Scoring & Loan Decisioning")
        sensitive_data = bool(profile.get("sensitive_data", True))
        data_types = profile.get("data_types", ["Personal Financial Records"])
        deployment_stage = profile.get("deployment_stage", "Production")
        decision_impact = profile.get("decision_impact", "High Impact (Binding Financial Denial/Approval)")
        human_oversight = profile.get("human_oversight", "Fully Autonomous (No Routine Human Review)")
        third_party_components = bool(profile.get("third_party_components", False))
        risk_level = profile.get("risk_level", "HIGH")

        applicable_requirements = []
        excluded_requirements = []

        is_finance_sector = (
            "Finance" in sector or "Banking" in sector or 
            "Bank" in org_type or "Fintech" in org_type or "Insurance" in org_type
        )
        is_saudi_jurisdiction = (
            "Saudi" in jurisdiction or "KSA" in jurisdiction or "Global" in jurisdiction
        )
        is_high_impact = (
            "High" in decision_impact or "Critical" in risk_level or "Production" in deployment_stage
        )
        is_credit_or_lending = (
            "Credit" in ai_use_case or "Loan" in ai_use_case or "Underwriting" in ai_use_case
        )
        is_fraud_or_aml = (
            "Fraud" in ai_use_case or "AML" in ai_use_case or "Transaction" in ai_use_case
        )
        is_genai_or_bot = (
            "Chatbot" in ai_use_case or "Generative" in ai_use_case or "LLM" in ai_use_case
        )

        for req in requirements:
            prov = req.get("provenance") or {}
            source_id = prov.get("source_id") or req.get("source_id", "UNKNOWN")
            source_type = prov.get("source_type") or req.get("source_type", "REGULATORY_GUIDANCE")
            req_jurisdiction = prov.get("jurisdiction") or req.get("jurisdiction", "Saudi Arabia (KSA)")
            req_sector = prov.get("sector") or req.get("sector", "Cross-Sector")
            framework = prov.get("framework") or req.get("source_title", "Regulatory Framework")
            clause = prov.get("clause") or req.get("article_section", "Clause")
            req_id = prov.get("requirement_id") or req.get("requirement_id", f"REQ-{req.get('chunk_id')}")
            req_text = prov.get("requirement_text") or req.get("content_text", "")
            risk_domain = req.get("risk_domain", "REGULATORY_COMPLIANCE")

            applicability_reasons = []
            exclusion_reasons = []
            is_applicable = True

            # ----------------------------------------------------
            # STAGE 1: JURISDICTION FILTER
            # ----------------------------------------------------
            if "European Union" in req_jurisdiction and not ("European Union" in jurisdiction or "Global" in jurisdiction):
                is_applicable = False
                exclusion_reasons.append(
                    f"✗ Excluded: Regulation jurisdiction ({req_jurisdiction}) does not apply to assessed jurisdiction ({jurisdiction})"
                )
            elif "Hong Kong" in req_jurisdiction and not ("Hong Kong" in jurisdiction or "Global" in jurisdiction):
                is_applicable = False
                exclusion_reasons.append(
                    f"✗ Excluded: Hong Kong supervisory rules do not apply to assessed jurisdiction ({jurisdiction})"
                )
            elif "Singapore" in req_jurisdiction and not ("Singapore" in jurisdiction or "Global" in jurisdiction):
                is_applicable = False
                exclusion_reasons.append(
                    f"✗ Excluded: MAS Singapore principles do not apply to assessed jurisdiction ({jurisdiction})"
                )
            elif ("Saudi Arabia" in req_jurisdiction or "KSA" in req_jurisdiction) and not is_saudi_jurisdiction:
                is_applicable = False
                exclusion_reasons.append(
                    f"✗ Excluded: Saudi national law/regulation does not apply to jurisdiction ({jurisdiction})"
                )
            else:
                applicability_reasons.append(f"✓ Jurisdiction Match: {req_jurisdiction} applies to {jurisdiction}")

            # ----------------------------------------------------
            # STAGE 2: SECTOR FILTER
            # ----------------------------------------------------
            if "Banking & Finance" in req_sector and not is_finance_sector:
                is_applicable = False
                exclusion_reasons.append(
                    f"✗ Excluded: Regulation applies exclusively to Banking & Financial institutions (Assessed Sector: {sector})"
                )
            elif "Banking & Finance" in req_sector and is_finance_sector:
                applicability_reasons.append(f"✓ Sector Match: Financial Services regulation applied to {org_type}")
            elif "Cross-Sector" in req_sector:
                applicability_reasons.append(f"✓ Sector Scope: Universal cross-sector governance standard applied")

            # ----------------------------------------------------
            # STAGE 3: DATA & PRIVACY TRIGGERS
            # ----------------------------------------------------
            if "PDPL" in source_id or "privacy" in risk_domain.lower() or "data_governance" in risk_domain.lower():
                if sensitive_data or any("personal" in str(dt).lower() or "financial" in str(dt).lower() for dt in data_types):
                    applicability_reasons.append(f"✓ Data Trigger: System processes sensitive/personal data ({', '.join(data_types[:2])})")
                else:
                    is_applicable = False
                    exclusion_reasons.append("✗ Excluded: System does not process personal or sensitive customer data")

            # ----------------------------------------------------
            # STAGE 4: USE CASE & IMPACT TRIGGERS
            # ----------------------------------------------------
            if "AML_FRAUD" in source_id and not is_fraud_or_aml:
                is_applicable = False
                exclusion_reasons.append(f"✗ Excluded: Financial crime / AML regulations apply to Transaction Monitoring & Fraud models, not {ai_use_case}")

            if "SDAIA_GENAI" in source_id and not is_genai_or_bot:
                is_applicable = False
                exclusion_reasons.append(f"✗ Excluded: Generative AI guidelines apply to LLM/NLP models, not {ai_use_case}")

            if is_credit_or_lending and ("SAMA_AI" in source_id or "MRM" in source_id):
                applicability_reasons.append(f"✓ Use Case Trigger: High-impact automated credit scoring & loan decisioning subject to Model Risk Management")

            if is_high_impact:
                applicability_reasons.append(f"✓ Decision Impact: {decision_impact} in {deployment_stage} environment requires mandatory compliance controls")

            if third_party_components and ("third_party" in risk_domain.lower() or "vendor" in req_text.lower()):
                applicability_reasons.append("✓ Vendor Risk Trigger: System incorporates third-party proprietary AI components")
            elif not third_party_components and "third_party" in risk_domain.lower():
                is_applicable = False
                exclusion_reasons.append("✗ Excluded: System is built 100% in-house with no third-party vendor dependencies")

            # Final Evaluation Assembly
            eval_record = {
                "requirement_id": req_id,
                "source_id": source_id,
                "framework": framework,
                "clause": clause,
                "source_type": source_type,
                "applicable": is_applicable,
                "confidence": 1.0,
                "applicability_reasons": applicability_reasons if is_applicable else [],
                "exclusion_reasons": exclusion_reasons if not is_applicable else [],
                "match_criteria": {
                    "jurisdiction_match": is_saudi_jurisdiction or "International" in req_jurisdiction,
                    "sector_match": is_finance_sector,
                    "sensitive_data_match": sensitive_data,
                    "high_impact_match": is_high_impact,
                },
                "provenance": prov,
                "requirement_text": req_text,
                "weight": req.get("weight", 1.0)
            }

            if is_applicable:
                applicable_requirements.append(eval_record)
            else:
                excluded_requirements.append(eval_record)

        return {
            "total_evaluated_requirements": len(requirements),
            "applicable_count": len(applicable_requirements),
            "excluded_count": len(excluded_requirements),
            "applicability_ratio": round(len(applicable_requirements) / len(requirements), 3) if requirements else 0.0,
            "evaluated_profile": profile,
            "applicable_requirements": applicable_requirements,
            "excluded_requirements": excluded_requirements,
            "evaluated_at": datetime.utcnow().isoformat()
        }

# Global singleton instance
applicability_engine = RegulatoryApplicabilityEngine()
