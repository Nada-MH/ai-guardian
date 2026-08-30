import enum
import uuid
from typing import List, TYPE_CHECKING, Optional
from sqlalchemy import String, Boolean, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.organization import Organization
    from models.ai_system import AISystem
    from models.assessment import Assessment
    from models.audit import AuditLog

class UserRole(str, enum.Enum):
    SYS_ADMIN = "sys_admin"
    COMPLIANCE_OFFICER = "compliance_officer"
    RISK_MANAGER = "risk_manager"
    AI_MODEL_OWNER = "ai_model_owner"
    AUDITOR = "auditor"

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum"),
        nullable=False,
        default=UserRole.COMPLIANCE_OFFICER
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")
    owned_ai_systems: Mapped[List["AISystem"]] = relationship("AISystem", back_populates="owner_user")
    initiated_assessments: Mapped[List["Assessment"]] = relationship("Assessment", back_populates="initiated_by_user")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user")

    __table_args__ = (
        Index("idx_users_org_role", "organization_id", "role"),
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
