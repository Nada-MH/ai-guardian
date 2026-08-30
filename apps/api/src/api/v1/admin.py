from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.dependencies import require_admin
from src.api.schemas import PaginatedResponse

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.audit import AuditLog

router = APIRouter()

@router.get("/audit-logs", response_model=PaginatedResponse)
async def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    action_filter: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Query immutable organization audit logs (admin only)."""
    base = select(AuditLog).where(AuditLog.organization_id == current_user.organization_id)
    if action_filter:
        base = base.where(AuditLog.action == action_filter)

    total = (await db.execute(select(func.count()).select_from(base.subquery()))).scalar() or 0
    result = await db.execute(
        base.offset((page - 1) * page_size).limit(page_size).order_by(AuditLog.created_at.desc())
    )
    items = result.scalars().all()

    return PaginatedResponse(
        items=[{
            "id": str(log.id),
            "user_id": str(log.user_id) if log.user_id else None,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": str(log.resource_id) if log.resource_id else None,
            "ip_address": log.ip_address,
            "details": log.details,
            "timestamp": log.created_at.isoformat(),
        } for log in items],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )
