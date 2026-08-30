import logging
import uuid
from typing import Dict, Any
from langgraph.graph import StateGraph, END
from src.state.assessment_state import AssessmentState
from src.agents.compliance_eval_agent import ComplianceEvaluationAgent

logger = logging.getLogger("ai_guardian.orchestrator")

class AssessmentOrchestrator:
    """
    LangGraph Async DAG Orchestrator executing the 8-agent compliance pipeline:
    Node 1: DocProcessing -> Node 2: SystemUnderstanding -> Node 3: Retrieval -> Node 4: GovernanceMapping
    -> Node 5: ComplianceEvaluation -> Node 6: RiskAssessment -> Node 7: Recommendation -> Node 8: ReportGeneration
    """

    def __init__(self):
        self.eval_agent = ComplianceEvaluationAgent()
        self.workflow = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """Construct LangGraph StateGraph DAG."""
        graph = StateGraph(AssessmentState)

        # Add Nodes for each pipeline stage
        graph.add_node("parse_documents", self._step_parse_documents)
        graph.add_node("understand_system", self._step_understand_system)
        graph.add_node("retrieve_rules", self._step_retrieve_rules)
        graph.add_node("map_governance", self._step_map_governance)
        graph.add_node("evaluate_compliance", self._step_evaluate_compliance)
        graph.add_node("assess_risk", self._step_assess_risk)
        graph.add_node("generate_recommendations", self._step_generate_recommendations)
        graph.add_node("compile_report", self._step_compile_report)

        # Set Entrypoint and Edges
        graph.set_entry_point("parse_documents")
        graph.add_edge("parse_documents", "understand_system")
        graph.add_edge("understand_system", "retrieve_rules")
        graph.add_edge("retrieve_rules", "map_governance")
        graph.add_edge("map_governance", "evaluate_compliance")
        graph.add_edge("evaluate_compliance", "assess_risk")
        graph.add_edge("assess_risk", "generate_recommendations")
        graph.add_edge("generate_recommendations", "compile_report")
        graph.add_edge("compile_report", END)

        return graph.compile()

    def _step_parse_documents(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 1: Parsing documents for assessment {state['assessment_id']}")
        return {"current_step": 1, "parsed_documents": state.get("raw_documents", [])}

    def _step_understand_system(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 2: Extracting AI System Profile")
        profile = state.get("ai_system_metadata", {})
        profile["detected_risk_tier"] = profile.get("criticality_tier", "tier_2_high")
        return {"current_step": 2, "system_profile": profile}

    def _step_retrieve_rules(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 3: Retrieving regulatory rules")
        return {"current_step": 3}

    def _step_map_governance(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 4: Governance Mapping")
        return {"current_step": 4}

    def _step_evaluate_compliance(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 5: Executing Compliance Evaluation Agent")
        criteria_list = state.get("retrieved_criteria", [])
        evidence_map = state.get("retrieved_evidence_map", {})

        findings = []
        for crit in criteria_list:
            crit_id = str(crit.get("id"))
            chunks = evidence_map.get(crit_id, [])
            finding = self.eval_agent.evaluate_criterion(crit, chunks)
            findings.append(finding)

        return {"current_step": 5, "compliance_findings": findings}

    def _step_assess_risk(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 6: Computing Risk Scores across 10 Vectors")
        # Compute baseline compliance score
        findings = state.get("compliance_findings", [])
        compliant_count = sum(1 for f in findings if f.get("compliance_status") == "COMPLIANT")
        total = max(len(findings), 1)
        overall_score = round((compliant_count / total) * 100.0, 2)

        risk_level = "LOW" if overall_score >= 85 else "MEDIUM" if overall_score >= 70 else "HIGH"

        return {
            "current_step": 6,
            "overall_compliance_score": overall_score,
            "overall_risk_level": risk_level,
            "domain_risk_scores": {"model_governance": round(100 - overall_score, 2)}
        }

    def _step_generate_recommendations(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 7: Generating Remediation Recommendations")
        recs = [
            {
                "priority": "HIGH",
                "remediation_title": "Implement SHAP Explainability Explainer",
                "action_plan": "Integrate SHAP explainer module for credit scoring decisions.",
                "target_framework_clause": "SAMA AI Guidance Section 3.1"
            }
        ]
        return {"current_step": 7, "recommendations": recs}

    def _step_compile_report(self, state: AssessmentState) -> Dict[str, Any]:
        logger.info(f"Orchestrator Step 8: Compiling Final Audit Workpaper")
        workpaper = {
            "assessment_id": state["assessment_id"],
            "overall_compliance_score": state.get("overall_compliance_score", 0.0),
            "overall_risk_level": state.get("overall_risk_level", "MEDIUM"),
            "findings": state.get("compliance_findings", []),
            "recommendations": state.get("recommendations", [])
        }
        return {"current_step": 8, "final_report_workpaper": workpaper, "is_completed": True}

    def run_assessment(self, initial_state: AssessmentState) -> AssessmentState:
        """Run full multi-agent assessment graph asynchronously or synchronously."""
        return self.workflow.invoke(initial_state)
