from typing import TypedDict, List, Dict, Any, Optional

class AssessmentState(TypedDict):
    """
    Shared execution state contract passed across the 8 agents in the LangGraph execution graph.
    """
    # Identifiers
    assessment_id: str
    organization_id: str
    ai_system_id: str

    # System Input Data
    ai_system_metadata: Dict[str, Any]
    raw_documents: List[Dict[str, Any]]

    # Step 1 & 2 Output: Parsed Docs & AI Profile
    parsed_documents: List[Dict[str, Any]]
    system_profile: Dict[str, Any]
    assessment_profile: Dict[str, Any]

    # Deterministic Applicability Engine Output
    applicability_matrix: Optional[Dict[str, Any]]
    applicable_requirement_ids: Optional[List[str]]
    excluded_requirement_ids: Optional[List[str]]

    # Step 3 & 4 Output: Retrieval & Governance Mapping
    target_framework_codes: List[str]
    retrieved_criteria: List[Dict[str, Any]]
    retrieved_evidence_map: Dict[str, List[Dict[str, Any]]]

    # Step 5 Output: Compliance Evaluation Findings
    compliance_findings: List[Dict[str, Any]]

    # Step 6 Output: Risk Vector Scores (10 Financial Risk Vectors)
    domain_risk_scores: Dict[str, float]
    overall_compliance_score: float
    overall_risk_level: str

    # Step 7 Output: Prioritized Recommendations
    recommendations: List[Dict[str, Any]]

    # Step 8 Output: Final Workpaper JSON Report
    final_report_workpaper: Dict[str, Any]

    # Execution Graph Control Flags
    current_step: int
    errors: List[Dict[str, Any]]
    is_completed: bool

    # Simulation Fields (Devil's Advocate Agent)
    simulation_scenarios: Optional[List[Dict[str, Any]]]
    simulation_timeline: Optional[List[Dict[str, Any]]]
    simulation_score_history: Optional[List[Dict[str, Any]]]
    simulation_completed: Optional[bool]

    # Generative What-If Optimization Fields (Agent 10)
    what_if_scenarios: Optional[List[Dict[str, Any]]]
    what_if_active_chips: Optional[List[str]]
    what_if_projected_scores: Optional[Dict[str, float]]

