import logging
from typing import Dict, Any, List
import json
from src.llm_client import GroqLLMClient
from src.agents.base_agent import BaseAgent

logger = logging.getLogger("ai_guardian.agents.devils_advocate")

class DevilsAdvocateAgent(BaseAgent):
    """
    Agent responsible for generating realistic post-deployment AI governance
    failure scenarios and simulations.
    """

    def __init__(self):
        system_prompt = (
            "You are the Explainable Devil's Advocate Simulator for AI Guardian. "
            "Your objective is to generate realistic, adversarial failure scenarios that challenge the AI system's governance posture. "
            "CRITICAL RULE: Never generate arbitrary scenarios. Every scenario MUST be grounded in: "
            "assessment findings, regulatory requirements, evidence, architecture, policies, controls, vendors, and data flows.\n\n"
            "Supported Categories: DATA_LEAKAGE, MODEL_MANIPULATION, BIAS_DISCRIMINATION, VENDOR_FAILURE, "
            "HUMAN_OVERSIGHT_FAILURE, REGULATORY_CHANGE, SECURITY_FAILURE, MONITORING_FAILURE, DOCUMENTATION_FAILURE, GOVERNANCE_FAILURE.\n\n"
            "For every scenario output JSON with:\n"
            "- scenario_id, title, description, risk_category, severity\n"
            "- trigger_conditions (list of detected system attributes/gaps)\n"
            "- related_findings, related_requirements, related_evidence\n"
            "- risk_simulation (likelihood: 1-5, impact: 1-5, inherent_risk: 1-25, existing_controls, control_effectiveness_pct, residual_risk)\n"
            "- provenance_explanation (explicit 'why was this scenario generated' breakdown)\n"
            "- choices (interactive decision options with consequences)\n"
            "- mitigations (recommended actions with score recovery deltas)\n"
            "- disclaimer ('Simulated Adversarial Governance Scenario — Stress Testing Governance Boundaries (Not a Prediction)')"
        )
        super().__init__(agent_name="DevilsAdvocateAgent", system_prompt=system_prompt)

    def generate_scenarios(self, system_profile: Dict[str, Any], assessment_findings: List[Dict[str, Any]], industry: str, risk_level: str, deployment_stage: str) -> Dict[str, Any]:
        """Generate a suite of initial failure scenarios."""
        user_prompt = (
            f"Generate AI governance failure scenarios based on the following context:\n"
            f"Industry: {industry}\n"
            f"Risk Level: {risk_level}\n"
            f"Deployment Stage: {deployment_stage}\n"
            f"System Profile: {json.dumps(system_profile)}\n"
            f"Assessment Findings: {json.dumps(assessment_findings)}\n\n"
            f"Ensure output exactly matches the requested JSON structure."
        )
        logger.info("DevilsAdvocateAgent: Generating scenarios...")
        return self.execute(user_prompt=user_prompt)

    def generate_single_scenario(self, system_profile: Dict[str, Any], assessment_findings: List[Dict[str, Any]], industry: str, risk_level: str, deployment_stage: str) -> Dict[str, Any]:
        """Generate a single new failure scenario for ongoing simulation."""
        user_prompt = (
            f"Generate exactly ONE NEW AI governance failure scenario based on the following context:\n"
            f"Industry: {industry}\n"
            f"Risk Level: {risk_level}\n"
            f"Deployment Stage: {deployment_stage}\n"
            f"System Profile: {json.dumps(system_profile)}\n"
            f"Assessment Findings: {json.dumps(assessment_findings)}\n\n"
            f"Output must be structured JSON with 'scenarios' containing exactly one scenario object."
        )
        logger.info("DevilsAdvocateAgent: Generating single new scenario...")
        return self.execute(user_prompt=user_prompt)
