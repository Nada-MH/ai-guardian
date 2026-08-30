"""
AI Guardian — Remediation & Governance Lifecycle API Router
Provides REST endpoints for managing remediation actions, uploading evidence,
triggering automated reassessment, and conducting compliance officer verification sign-offs.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel, Field

from src.core.governance.lifecycle_service import governance_lifecycle_service

router = APIRouter()

class CreateActionRequest(BaseModel):
    finding_id: Optional[str] = None
    requirement_id: str
    framework: str
    clause: str
    title: str
    description: str
    owner_name: str
    owner_type: str = "INDIVIDUAL" # INDIVIDUAL, TEAM, DEPARTMENT
    department: str = "AI Governance"
    priority: str = "HIGH"
    due_date: Optional[str] = None
    evidence_required: bool = True
    evidence_description: Optional[str] = None

class UploadEvidenceRequest(BaseModel):
    evidence_name: str
    evidence_excerpt: str
    evidence_strength: str = "STRONG"
    uploader_name: str = "Compliance Officer"

class VerificationRequest(BaseModel):
    verifier_name: str
    verifier_role: str = "Chief Compliance Officer"
    verification_notes: str = Field(..., min_length=5, description="Sign-off audit rationale notes")

class RejectionRequest(BaseModel):
    verifier_name: str
    rejection_reason: str = Field(..., min_length=5, description="Substantive reason for rejecting verification")

@router.get("/actions", summary="Query Remediation Actions")
async def get_remediation_actions(
    status: Optional[str] = Query(None, description="Filter by status (OPEN, IN_PROGRESS, PENDING_VERIFICATION, CLOSED)"),
    priority: Optional[str] = Query(None, description="Filter by priority (CRITICAL, HIGH, MEDIUM, LOW)"),
    department: Optional[str] = Query(None, description="Filter by department"),
    owner_name: Optional[str] = Query(None, description="Filter by owner name")
):
    """Retrieves all tracked governance remediation actions."""
    actions = governance_lifecycle_service.get_actions(
        status=status,
        priority=priority,
        department=department,
        owner_name=owner_name
    )
    return {
        "total_actions": len(actions),
        "actions": actions
    }

@router.get("/metrics", summary="Get Continuous Governance Dashboard Metrics")
async def get_governance_metrics():
    """Returns executive KPIs including Open Actions, Overdue, Avg Resolution Time, and Risk Reduction."""
    return governance_lifecycle_service.get_governance_metrics()

@router.post("/actions", summary="Create Remediation Action")
async def create_action(request: CreateActionRequest):
    """Creates and assigns a new remediation action."""
    action = governance_lifecycle_service.create_remediation_action(
        finding_id=request.finding_id,
        requirement_id=request.requirement_id,
        framework=request.framework,
        clause=request.clause,
        title=request.title,
        description=request.description,
        owner_name=request.owner_name,
        owner_type=request.owner_type,
        department=request.department,
        priority=request.priority,
        due_date=request.due_date,
        evidence_required=request.evidence_required,
        evidence_description=request.evidence_description
    )
    return {
        "status": "CREATED",
        "action": action
    }

@router.post("/actions/{action_id}/upload-evidence", summary="Upload Evidence & Trigger Automatic Reassessment")
async def upload_evidence(action_id: str, request: UploadEvidenceRequest):
    """
    Attaches evidence to an action, automatically re-evaluates the affected requirement,
    recalculates score improvement, and moves the action to PENDING_VERIFICATION.
    """
    try:
        updated_action = governance_lifecycle_service.upload_evidence_and_trigger_reassessment(
            action_id=action_id,
            evidence_name=request.evidence_name,
            evidence_excerpt=request.evidence_excerpt,
            evidence_strength=request.evidence_strength,
            uploader_name=request.uploader_name
        )
        return {
            "status": "REASSESSED",
            "message": f"Action reassessed with {updated_action['reassessment_status']} (+{updated_action['reassessment_score_delta']}%). Awaiting compliance officer verification.",
            "action": updated_action
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/actions/{action_id}/verify", summary="Compliance Officer Sign-off & Finding Closure")
async def verify_action(action_id: str, request: VerificationRequest):
    """Officially verifies evidence and closes the finding."""
    try:
        closed_action = governance_lifecycle_service.verify_and_close_action(
            action_id=action_id,
            verifier_name=request.verifier_name,
            verifier_role=request.verifier_role,
            verification_notes=request.verification_notes
        )
        return {
            "status": "VERIFIED_AND_CLOSED",
            "message": "Action verified and finding successfully resolved.",
            "action": closed_action
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/actions/{action_id}/reject", summary="Reject Verification & Request Revision")
async def reject_action(action_id: str, request: RejectionRequest):
    """Rejects verification and returns the action to IN_PROGRESS."""
    try:
        rejected_action = governance_lifecycle_service.reject_verification(
            action_id=action_id,
            verifier_name=request.verifier_name,
            rejection_reason=request.rejection_reason
        )
        return {
            "status": "REJECTED_FOR_REVISION",
            "message": "Action returned to implementation owner for revision.",
            "action": rejected_action
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
