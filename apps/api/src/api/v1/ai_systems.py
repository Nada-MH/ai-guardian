import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user, require_model_owner
from src.api.schemas import (
    AISystemCreate, AISystemResponse, AISystemUpdate,
    AIModelCreate, PaginatedResponse,
)

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.ai_system import AISystem, AIModel, FinancialUseCase, CriticalityTier, DeploymentStatus

router = APIRouter()

@router.get("", response_model=PaginatedResponse)
async def list_ai_systems(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    criticality_tier: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List registered AI systems for the current organization (paginated)."""
    query = select(AISystem).where(AISystem.organization_id == current_user.organization_id)
    if criticality_tier:
        query = query.where(AISystem.criticality_tier == criticality_tier)

    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar() or 0

    query = query.offset((page - 1) * page_size).limit(page_size).order_by(AISystem.created_at.desc())
    result = await db.execute(query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[AISystemResponse.model_validate(s) for s in items],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )

@router.post("", response_model=AISystemResponse, status_code=status.HTTP_201_CREATED)
async def create_ai_system(
    payload: AISystemCreate,
    current_user: User = Depends(require_model_owner),
    db: AsyncSession = Depends(get_db),
):
    """Register a new AI system."""
    # Check duplicate code_identifier within org
    existing = await db.execute(
        select(AISystem).where(
            AISystem.organization_id == current_user.organization_id,
            AISystem.code_identifier == payload.code_identifier,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate code_identifier within organization")

    ai_system = AISystem(
        id=uuid.uuid4(),
        organization_id=current_user.organization_id,
        name=payload.name,
        code_identifier=payload.code_identifier,
        business_purpose=payload.business_purpose,
        financial_use_case=FinancialUseCase(payload.financial_use_case),
        criticality_tier=CriticalityTier(payload.criticality_tier),
        deployment_status=DeploymentStatus(payload.deployment_status),
        owner_user_id=current_user.id,
    )
    db.add(ai_system)
    await db.commit()
    await db.refresh(ai_system)
    return ai_system

@router.get("/{system_id}", response_model=AISystemResponse)
async def get_ai_system(
    system_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get AI system details by ID."""
    result = await db.execute(
        select(AISystem).where(
            AISystem.id == system_id,
            AISystem.organization_id == current_user.organization_id,
        )
    )
    system = result.scalar_one_or_none()
    if not system:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI System not found")
    return system

@router.put("/{system_id}", response_model=AISystemResponse)
async def update_ai_system(
    system_id: uuid.UUID,
    payload: AISystemUpdate,
    current_user: User = Depends(require_model_owner),
    db: AsyncSession = Depends(get_db),
):
    """Update AI system metadata."""
    result = await db.execute(
        select(AISystem).where(AISystem.id == system_id, AISystem.organization_id == current_user.organization_id)
    )
    system = result.scalar_one_or_none()
    if not system:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI System not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(system, field, value)

    await db.commit()
    await db.refresh(system)
    return system

@router.post("/{system_id}/models", status_code=status.HTTP_201_CREATED)
async def add_model(
    system_id: uuid.UUID,
    payload: AIModelCreate,
    current_user: User = Depends(require_model_owner),
    db: AsyncSession = Depends(get_db),
):
    """Add an AI model version to a system."""
    model = AIModel(
        id=uuid.uuid4(),
        ai_system_id=system_id,
        model_name=payload.model_name,
        version=payload.version,
        algorithm_type=payload.algorithm_type,
        is_third_party=payload.is_third_party,
        vendor_name=payload.vendor_name,
        training_data_summary=payload.training_data_summary,
    )
    db.add(model)
    await db.commit()
    return {"id": str(model.id), "message": "Model added successfully"}
