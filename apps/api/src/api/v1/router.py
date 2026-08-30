from fastapi import APIRouter
from src.api.v1 import auth, organizations, ai_systems, assessments, documents, knowledge_base, reports, admin, annotations, audit, gap_analysis, remediation, simulator, what_if, executive, self_governance, evaluation, observability

api_v1_router = APIRouter()

api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_v1_router.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
api_v1_router.include_router(ai_systems.router, prefix="/ai-systems", tags=["AI Systems"])
api_v1_router.include_router(documents.router, prefix="/ai-systems", tags=["Documents"])
api_v1_router.include_router(assessments.router, prefix="/assessments", tags=["Assessments"])
api_v1_router.include_router(annotations.router, prefix="/evidence", tags=["AI Evidence Annotations"])
api_v1_router.include_router(knowledge_base.router, prefix="/knowledge-base", tags=["Knowledge Base"])
api_v1_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_v1_router.include_router(audit.router, prefix="/audit", tags=["Audit Trail & Tamper-Evidence"])
api_v1_router.include_router(gap_analysis.router, prefix="/gap-analysis", tags=["Standards & Policy Gap Analysis"])
api_v1_router.include_router(remediation.router, prefix="/remediation", tags=["Governance Lifecycle & Remediation"])
api_v1_router.include_router(simulator.router, prefix="/simulator", tags=["Explainable Adversarial Simulator"])
api_v1_router.include_router(what_if.router, prefix="/what-if", tags=["Uncertainty-Aware What-If Simulator"])
api_v1_router.include_router(executive.router, prefix="/executive", tags=["Executive Governance Dashboard"])
api_v1_router.include_router(self_governance.router, prefix="/self-governance", tags=["AI Guardian Self-Governance"])
api_v1_router.include_router(evaluation.router, prefix="/evaluations", tags=["AI Quality Evaluation & QA"])
api_v1_router.include_router(observability.router, prefix="/observability", tags=["System Health & Observability"])
api_v1_router.include_router(admin.router, prefix="/admin", tags=["Administration"])

