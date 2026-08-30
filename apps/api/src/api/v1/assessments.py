import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user, require_compliance
from src.api.schemas import (
    AssessmentInitiate, AssessmentResponse, ComplianceFindingResponse,
    RiskScoreResponse, RecommendationResponse, PaginatedResponse,
)

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.ai_system import AISystem
from models.assessment import Assessment, AssessmentType, AssessmentStatus
from models.compliance import ComplianceFinding
from models.risk import RiskScore
from models.recommendation import Recommendation

router = APIRouter()

@router.post("/initiate", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def initiate_assessment(
    payload: AssessmentInitiate,
    current_user: User = Depends(require_compliance),
    db: AsyncSession = Depends(get_db),
):
    """Initiate a new multi-agent compliance assessment."""
    # Verify AI system belongs to user's org
    result = await db.execute(
        select(AISystem).where(
            AISystem.id == payload.ai_system_id,
            AISystem.organization_id == current_user.organization_id,
        )
    )
    ai_system = result.scalar_one_or_none()
    if not ai_system:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI System not found in your organization")

    # Enforce Tier 1 deep audit rule
    if ai_system.criticality_tier.value == "tier_1_critical" and payload.assessment_depth != "deep_audit":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Tier 1 Critical systems require 'deep_audit' assessment depth",
        )

    assessment = Assessment(
        id=uuid.uuid4(),
        ai_system_id=payload.ai_system_id,
        initiated_by_user_id=current_user.id,
        assessment_type=AssessmentType(payload.assessment_type),
        status=AssessmentStatus.QUEUED,
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)

    # TODO: Dispatch Celery task to orchestrate multi-agent pipeline
    # run_assessment_pipeline.delay(str(assessment.id), payload.model_dump())

    return assessment

@router.get("", response_model=PaginatedResponse)
async def list_assessments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List assessment history for the user's organization."""
    base = (
        select(Assessment)
        .join(AISystem, Assessment.ai_system_id == AISystem.id)
        .where(AISystem.organization_id == current_user.organization_id)
    )
    if status_filter:
        base = base.where(Assessment.status == status_filter)

    total = (await db.execute(select(func.count()).select_from(base.subquery()))).scalar() or 0
    result = await db.execute(base.offset((page - 1) * page_size).limit(page_size).order_by(Assessment.started_at.desc()))
    items = result.scalars().all()

    return PaginatedResponse(
        items=[AssessmentResponse.model_validate(a) for a in items],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )

@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get assessment summary and overall score."""
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return assessment

@router.get("/{assessment_id}/status")
async def get_assessment_status(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get live assessment execution status."""
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    return {
        "assessment_id": str(assessment.id),
        "status": assessment.status.value,
        "overall_compliance_score": float(assessment.overall_compliance_score) if assessment.overall_compliance_score else None,
        "risk_level": assessment.risk_level.value if assessment.risk_level else None,
        "started_at": assessment.started_at.isoformat(),
        "completed_at": assessment.completed_at.isoformat() if assessment.completed_at else None,
    }

@router.get("/{assessment_id}/findings", response_model=List[ComplianceFindingResponse])
async def get_findings(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get criteria-level compliance findings for an assessment."""
    result = await db.execute(
        select(ComplianceFinding).where(ComplianceFinding.assessment_id == assessment_id)
    )
    return result.scalars().all()

@router.get("/{assessment_id}/risk-matrix", response_model=List[RiskScoreResponse])
async def get_risk_matrix(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get 10-domain risk vector breakdown for an assessment."""
    result = await db.execute(
        select(RiskScore).where(RiskScore.assessment_id == assessment_id)
    )
    return result.scalars().all()

@router.get("/{assessment_id}/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(
    assessment_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get prioritized remediation recommendations for an assessment."""
    result = await db.execute(
        select(Recommendation)
        .where(Recommendation.assessment_id == assessment_id)
        .order_by(Recommendation.priority.asc())
    )
    return result.scalars().all()
