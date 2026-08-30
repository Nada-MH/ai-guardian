"""
AI Guardian — Audit Trail API Router
Provides REST endpoints for querying tamper-evident audit logs,
verifying cryptographic hash chains, and recording human overrides.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel, Field

from src.core.audit.audit_service import audit_trail_service, GENESIS_HASH

router = APIRouter()

class HumanOverrideRequest(BaseModel):
    finding_id: str
    requirement_id: str
    original_status: str
    new_status: str
    reason: str = Field(..., min_length=10, description="Detailed justification rationale for overriding AI decision")
    user_name: str
    user_id: Optional[str] = None
    user_role: str = "Chief Compliance Officer"
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    assessment_id: Optional[str] = None
    assessment_version: Optional[int] = None
    external_evidence_id: Optional[str] = None

class AuditEventCreateRequest(BaseModel):
    event_type: str
    actor_name: str
    actor_type: str = "USER"
    actor_id: Optional[str] = None
    system_component: str = "API_GATEWAY"
    summary: str
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    assessment_id: Optional[str] = None
    assessment_version: Optional[int] = None
    previous_state: Optional[Dict[str, Any]] = None
    new_state: Optional[Dict[str, Any]] = None
    severity: str = "INFO"

@router.get("/events", summary="Query Append-Only Audit Trail")
async def get_audit_events(
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    actor_type: Optional[str] = Query(None, description="Filter by actor type (USER, AGENT, AUTOMATION, SYSTEM)"),
    actor_id: Optional[str] = Query(None, description="Filter by actor ID"),
    project_id: Optional[str] = Query(None, description="Filter by AI project ID"),
    assessment_id: Optional[str] = Query(None, description="Filter by assessment ID"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    system_component: Optional[str] = Query(None, description="Filter by system component"),
    search: Optional[str] = Query(None, description="Free text search query")
):
    """
    Retrieves chronological audit events from the immutable ledger.
    """
    events = audit_trail_service.get_events(
        event_type=event_type,
        actor_id=actor_id,
        actor_type=actor_type,
        project_id=project_id,
        assessment_id=assessment_id,
        severity=severity,
        system_component=system_component,
        search_query=search
    )
    return {
        "total_events": len(events),
        "events": events
    }

@router.get("/verify", summary="Verify Cryptographic Hash Chain Integrity")
async def verify_audit_ledger():
    """
    Cryptographically verifies the append-only SHA-256 hash chaining across all sequential records.
    Attests that no historical records have been modified, inserted, or deleted.
    """
    result = audit_trail_service.verify_ledger_integrity()
    return result

@router.post("/human-override", summary="Record a Human Compliance Officer Override")
async def record_human_override(request: HumanOverrideRequest):
    """
    Enforces mandatory human override workpaper protocols.
    Records the status mutation, justification reason, and signed reviewer identity into the immutable ledger.
    """
    try:
        event = audit_trail_service.record_human_override(
            finding_id=request.finding_id,
            requirement_id=request.requirement_id,
            original_status=request.original_status,
            new_status=request.new_status,
            reason=request.reason,
            user_name=request.user_name,
            user_id=request.user_id,
            user_role=request.user_role,
            project_id=request.project_id,
            project_name=request.project_name,
            assessment_id=request.assessment_id,
            assessment_version=request.assessment_version,
            external_evidence_id=request.external_evidence_id
        )
        return {
            "status": "RECORDED",
            "message": "Human override successfully sealed into audit ledger.",
            "event": event
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/events", summary="Record an Audit Event")
async def create_audit_event(request: AuditEventCreateRequest):
    """
    Appends a new event to the tamper-evident audit ledger.
    """
    event = audit_trail_service.record_event(
        event_type=request.event_type,
        actor_name=request.actor_name,
        actor_type=request.actor_type,
        actor_id=request.actor_id,
        system_component=request.system_component,
        summary=request.summary,
        project_id=request.project_id,
        project_name=request.project_name,
        assessment_id=request.assessment_id,
        assessment_version=request.assessment_version,
        previous_state=request.previous_state,
        new_state=request.new_state,
        severity=request.severity
    )
    return {
        "status": "RECORDED",
        "event_id": event["event_id"],
        "sequence_number": event["sequence_number"],
        "event_hash": event["event_hash"]
    }
