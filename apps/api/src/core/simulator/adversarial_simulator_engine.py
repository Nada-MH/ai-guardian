"""
AI Guardian — Explainable Adversarial Governance Simulator Engine
Generates realistic failure scenarios strictly grounded in:
Assessment Findings, Regulatory Requirements, Evidence, Architecture, Policies, Controls, Vendors, and Data Flows.
"""

import sys
import uuid
import logging
from typing import Dict, Any, List, Optional, Tuple, Union
from pathlib import Path

# Add database models path
DB_MODELS_PATH = Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"
if str(DB_MODELS_PATH) not in sys.path:
    sys.path.insert(0, str(DB_MODELS_PATH))

from models.simulator import AdversarialScenarioCategory

logger = logging.getLogger("ai_guardian.simulator_engine")

SIMULATION_DISCLAIMER = (
    "NOTICE: This is an adversarial stress-testing scenario generated to evaluate governance boundaries. "
    "It is NOT a prediction, guarantee, or certainty of future failure."
)

class AdversarialSimulatorEngine:
    """
    Simulates grounded failure scenarios with full provenance and quantitative risk modeling.
    """

    CATEGORIES = [c.value for c in AdversarialScenarioCategory]

    def create_grounded_scenario(
        self,
        title: str,
        description: str,
        category: Union[AdversarialScenarioCategory, str],
        severity: str,
        trigger_conditions: List[str],
        related_findings: List[str],
        related_requirements: List[str],
        related_evidence: List[str],
        likelihood_score: int, # 1 - 5
        impact_score: int, # 1 - 5
        existing_controls: List[str],
        control_effectiveness_pct: float, # 0 - 100
        mitigations: List[Dict[str, Any]],
        confidence: float = 0.95,
        generated_by: str = "DevilsAdvocateSimulator v2.4 (Grounded in Assessment Findings)"
    ) -> Dict[str, Any]:
        """
        Constructs and calculates risk metrics for an explainable adversarial scenario.
        """
        cat_val = category.value if hasattr(category, "value") else str(category)
        scenario_id = f"SCEN-{cat_val[:4]}-{str(uuid.uuid4())[:4]}".upper()

        # Quantitative Risk Calculations
        l_score = max(1, min(5, likelihood_score))
        i_score = max(1, min(5, impact_score))
        inherent_risk = l_score * i_score # 1 - 25

        eff_pct = max(0.0, min(100.0, control_effectiveness_pct))
        residual_risk = round(inherent_risk * (1.0 - (eff_pct / 100.0)), 2)

        provenance_explanation = {
            "why_generated": [
                f"Grounding Trigger: {cond}" for cond in trigger_conditions
            ],
            "related_finding_ids": related_findings,
            "related_regulatory_clauses": related_requirements,
            "related_evidence_artifacts": related_evidence
        }

        scenario = {
            "scenario_id": scenario_id,
            "title": title,
            "description": description,
            "risk_category": cat_val,
            "severity": severity.upper(),
            "trigger_conditions": trigger_conditions,
            "related_findings": related_findings,
            "related_requirements": related_requirements,
            "related_evidence": related_evidence,
            "risk_simulation": {
                "likelihood": l_score,
                "impact": i_score,
                "inherent_risk": inherent_risk,
                "existing_controls": existing_controls,
                "control_effectiveness_pct": eff_pct,
                "residual_risk": residual_risk
            },
            "provenance_explanation": provenance_explanation,
            "mitigations": mitigations,
            "confidence": confidence,
            "generated_by": generated_by,
            "disclaimer": SIMULATION_DISCLAIMER,
            "is_simulated": True
        }

        logger.info(f"Grounded scenario created: {scenario_id} [{cat_val}] - Inherent Risk: {inherent_risk}, Residual: {residual_risk}")
        return scenario

    def get_canonical_grounded_scenarios(self) -> List[Dict[str, Any]]:
        """
        Returns canonical failure scenarios grounded in FinTrust AI Loan Approval Engine.
        """
        return [
            self.create_grounded_scenario(
                title="Third-Party Model Exposes Citizen Financial Data via Unfiltered Egress",
                description="A downstream analytics partner microservice invokes an external cloud LLM API, transmitting unmasked borrower salary records and national ID tags without localization safeguards.",
                category=AdversarialScenarioCategory.VENDOR_FAILURE,
                severity="HIGH",
                trigger_conditions=[
                    "Third-party cloud analytics connector detected in architecture",
                    "Sensitive borrower financial records & SIMAH IDs present in data flow",
                    "Vendor monitoring policy missing (Section 5.2 gap)",
                    "Egress firewall tokenization rule absent on analytics endpoint"
                ],
                related_findings=["FND-004"],
                related_requirements=["REQ-NDMO-DATA-4.3", "REQ-SAUDI-PDPL-13"],
                related_evidence=["Internal_Data_Classification_Spec.pdf"],
                likelihood_score=4,
                impact_score=4,
                existing_controls=["Basic HTTPS transport encryption", "Internal data classification tag"],
                control_effectiveness_pct=30.0,
                mitigations=[
                    {"action": "Deploy local tokenization proxy before external egress", "risk_reduction": 10.0},
                    {"action": "Execute NDMO third-party data transfer audit", "risk_reduction": 5.0}
                ]
            ),
            self.create_grounded_scenario(
                title="Automated Rejection Cascade with Zero Underwriter Human Intervention",
                description="An unexpected macro-economic interest rate shock depresses credit scoring outputs, triggering automated loan rejection letters for 12,000 applicants without underwriter review paths.",
                category=AdversarialScenarioCategory.HUMAN_OVERSIGHT_FAILURE,
                severity="CRITICAL",
                trigger_conditions=[
                    "High-impact automated credit approval/denial workflow active in Production",
                    "Absence of manual underwriter escalation threshold in Model Spec v1",
                    "Finding FND-001 flagged 100% automated decisioning violation"
                ],
                related_findings=["FND-001"],
                related_requirements=["REQ-SAMA-AI-5.3"],
                related_evidence=["Loan_Model_Architecture_Spec.pdf (Page 4)"],
                likelihood_score=4,
                impact_score=5,
                existing_controls=["RabbitMQ underwriter review queue (Implemented in v2)"],
                control_effectiveness_pct=85.0,
                mitigations=[
                    {"action": "Maintain SLA limit of 24h on underwriter queue", "risk_reduction": 15.0}
                ]
            ),
            self.create_grounded_scenario(
                title="Evasion Attack Exploiting Unmonitored Postal Code Weights",
                description="Sophisticated loan applicants craft slightly perturbed employment tenures and zip codes to systematically bypass default risk classifiers.",
                category=AdversarialScenarioCategory.MODEL_MANIPULATION,
                severity="HIGH",
                trigger_conditions=[
                    "Model relies on socio-economic and regional postal feature weights",
                    "Adversarial evasion testing conducted exploratory only (FND-006)",
                    "No production input perturbation anomaly detector"
                ],
                related_findings=["FND-006"],
                related_requirements=["REQ-SAMA-AI-3.4", "REQ-MRM-SR117-2.1"],
                related_evidence=["Adversarial_Stress_Test_Harness_Initial_Runs.pdf"],
                likelihood_score=3,
                impact_score=4,
                existing_controls=["Nightly Jenkins FGSM test harness (Partial)"],
                control_effectiveness_pct=45.0,
                mitigations=[
                    {"action": "Deploy real-time inference feature drift and anomaly filter", "risk_reduction": 8.0}
                ]
            ),
            self.create_grounded_scenario(
                title="GenAI Explanation Generator Fabricates Adverse Action Rationale",
                description="Generative explanation letter engine hallucinates non-existent debt obligations when generating statutory rejection explanations for rejected borrowers.",
                category=AdversarialScenarioCategory.DOCUMENTATION_FAILURE,
                severity="HIGH",
                trigger_conditions=[
                    "LLM-generated explanation letter feature deployed in applicant portal",
                    "No formal GenAI Output Policy charter documented (FND-005)",
                    "Absence of automated semantic factuality grounding benchmark filter"
                ],
                related_findings=["FND-005"],
                related_requirements=["REQ-SDAIA-GENAI-4.1"],
                related_evidence=["Missing factuality test suite"],
                likelihood_score=4,
                impact_score=3,
                existing_controls=["Prompt engineering system restraint rules"],
                control_effectiveness_pct=25.0,
                mitigations=[
                    {"action": "Integrate RAG semantic grounding verification layer", "risk_reduction": 9.0}
                ]
            )
        ]


adversarial_simulator_engine = AdversarialSimulatorEngine()
