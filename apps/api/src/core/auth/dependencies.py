import uuid
from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.security import decode_token

# Import models via path — these are shared from packages/database
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User, UserRole

security_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency: extract and validate JWT, return the current User."""
    payload = decode_token(credentials.credentials)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token payload")

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return user


class RoleChecker:
    """Dependency factory enforcing RBAC role checks on endpoints."""

    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    async def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role.value}' does not have permission for this action",
            )
        return current_user

# Pre-built role dependencies for common access patterns
require_admin = RoleChecker([UserRole.SYS_ADMIN])
require_compliance = RoleChecker([UserRole.COMPLIANCE_OFFICER, UserRole.SYS_ADMIN])
require_risk = RoleChecker([UserRole.RISK_MANAGER, UserRole.COMPLIANCE_OFFICER, UserRole.SYS_ADMIN])
require_model_owner = RoleChecker([UserRole.AI_MODEL_OWNER, UserRole.COMPLIANCE_OFFICER, UserRole.SYS_ADMIN])
require_any_authenticated = RoleChecker([
    UserRole.SYS_ADMIN, UserRole.COMPLIANCE_OFFICER, UserRole.RISK_MANAGER,
    UserRole.AI_MODEL_OWNER, UserRole.AUDITOR
])
