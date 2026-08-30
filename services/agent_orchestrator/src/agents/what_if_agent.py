import logging
import json
from typing import Dict, Any, List
from src.llm_client import GroqLLMClient
from src.agents.base_agent import BaseAgent

logger = logging.getLogger("ai_guardian.agents.what_if")

class WhatIfAgent(BaseAgent):
    """
    Agent 10: Generative What-If Optimization Agent.
    Evaluates hypothetical architectural changes, feature modifications, and regulatory updates
    against the dual-layer RAG knowledge base to project score gains and satisfied regulatory clauses.
    """

    def __init__(self):
        system_prompt = (
            "You are the Uncertainty-Aware What-If Optimization Agent for AI Guardian. "
            "Your objective is to evaluate proposed architectural, engineering, or regulatory changes "
            "for an AI system without falsely promising that future compliance outcomes are guaranteed.\n\n"
            "CRITICAL RULES:\n"
            "1. Projected scores must be explainable and assumption-driven.\n"
            "2. Never state 'Compliance WILL increase by X'. Always state 'Projected improvement: +X under stated assumptions'.\n"
            "3. Support explicit Confidence Bands: HIGH_CONFIDENCE, MEDIUM_CONFIDENCE, LOW_CONFIDENCE.\n\n"
            "Output structured JSON with fields:\n"
            "- pill_label, title, proposed_action\n"
            "- score_deltas (dict of projected changes)\n"
            "- confidence_level (HIGH_CONFIDENCE | MEDIUM_CONFIDENCE | LOW_CONFIDENCE) & confidence_pct (int)\n"
            "- assumptions (list of explicit assumption statements)\n"
            "- satisfied_clauses (framework, clause, title)\n"
            "- progressive_stages (Policy, Policy+Control, Policy+Control+Monitoring)\n"
            "- disclaimer ('Projected improvement under stated assumptions. Not a guaranteed outcome.')"
        )
        super().__init__(agent_name="WhatIfAgent", system_prompt=system_prompt)

    def evaluate_hypothesis(
        self,
        system_profile: Dict[str, Any],
        active_findings: List[Dict[str, Any]],
        hypothetical_query: str
    ) -> Dict[str, Any]:
        """Evaluate a custom user-typed hypothetical query or proposed change."""
        user_prompt = (
            f"Evaluate the following hypothetical architectural change for the AI system:\n\n"
            f"AI System: {system_profile.get('name', 'AI Loan System')}\n"
            f"Industry: {system_profile.get('industry', 'Finance')}\n"
            f"Active Findings: {json.dumps(active_findings)}\n"
            f"Hypothetical Proposed Change: \"{hypothetical_query}\"\n\n"
            f"Output structured JSON matching the requested fields."
        )
        logger.info(f"WhatIfAgent: Evaluating hypothesis '{hypothetical_query}'...")
        return self.execute(user_prompt=user_prompt)

    def generate_project_what_if_pills(
        self,
        system_profile: Dict[str, Any],
        active_findings: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Dynamically generate context-specific What-If scenario pills based on project gaps."""
        user_prompt = (
            f"Based on the following AI system profile and active compliance findings, generate 6-8 tailored "
            f"What-If optimization action pills designed to remediate the system's compliance gaps:\n\n"
            f"System Profile: {json.dumps(system_profile)}\n"
            f"Active Findings: {json.dumps(active_findings)}\n\n"
            f"Return JSON containing key 'scenarios' which is a list of scenario objects."
        )
        logger.info("WhatIfAgent: Generating dynamic What-If scenario pills...")
        return self.execute(user_prompt=user_prompt)
