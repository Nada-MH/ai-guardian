from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user, require_admin
from src.api.schemas import OrganizationResponse, OrganizationUpdate

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.organization import Organization

router = APIRouter()

@router.get("/current", response_model=OrganizationResponse)
async def get_current_organization(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the current user's organization details."""
    result = await db.execute(select(Organization).where(Organization.id == current_user.organization_id))
    org = result.scalar_one_or_none()
    return org

@router.patch("/current", response_model=OrganizationResponse)
async def update_organization(
    updates: OrganizationUpdate,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update organization profile (admin only)."""
    result = await db.execute(select(Organization).where(Organization.id == current_user.organization_id))
    org = result.scalar_one_or_none()

    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(org, field, value)

    await db.commit()
    await db.refresh(org)
    return org
