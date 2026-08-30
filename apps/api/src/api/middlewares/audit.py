import uuid
import logging
from datetime import datetime, timezone
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from src.db.session import AsyncSessionLocal

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "packages" / "database"))
from models.audit import AuditLog

logger = logging.getLogger("ai_guardian.audit")

# Endpoints that should be logged
AUDITABLE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
SKIP_PATHS = {"/health", "/docs", "/redoc", "/openapi.json"}

class AuditLogMiddleware(BaseHTTPMiddleware):
    """Middleware that writes immutable audit log entries for state-mutating API calls."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Only audit state-mutating requests to non-system endpoints
        if request.method not in AUDITABLE_METHODS:
            return response
        if any(request.url.path.startswith(skip) for skip in SKIP_PATHS):
            return response

        try:
            # Extract user info from JWT if available (best-effort)
            user_id = None
            org_id = None
            auth_header = request.headers.get("authorization", "")
            if auth_header.startswith("Bearer "):
                from src.core.auth.security import decode_token
                payload = decode_token(auth_header.split(" ")[1])
                if payload:
                    user_id = payload.get("sub")
                    org_id = payload.get("org")

            # Determine action from path
            action = f"{request.method}_{request.url.path}".replace("/", "_").upper()

            async with AsyncSessionLocal() as session:
                log = AuditLog(
                    id=uuid.uuid4(),
                    organization_id=uuid.UUID(org_id) if org_id else None,
                    user_id=uuid.UUID(user_id) if user_id else None,
                    action=action[:100],
                    resource_type=request.url.path.split("/")[3] if len(request.url.path.split("/")) > 3 else "system",
                    ip_address=request.client.host if request.client else None,
                    user_agent=request.headers.get("user-agent", "")[:255],
                    details={"status_code": response.status_code, "path": str(request.url.path)},
                )
                session.add(log)
                await session.commit()

        except Exception as e:
            logger.warning(f"Audit log write failed (non-blocking): {e}")

        return response
