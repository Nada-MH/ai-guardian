import enum
import uuid
from typing import TYPE_CHECKING, Optional, Dict, Any, List
from sqlalchemy import String, Text, ForeignKey, Index, Enum, Integer, Numeric, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.ai_system import AISystem
    from models.assessment import Assessment
    from models.compliance import ComplianceFinding

class ActionStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    BLOCKED = "BLOCKED"
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    VERIFIED = "VERIFIED"
    CLOSED = "CLOSED"
    REJECTED = "REJECTED"

class OwnerType(str, enum.Enum):
    INDIVIDUAL = "INDIVIDUAL"
    TEAM = "TEAM"
    DEPARTMENT = "DEPARTMENT"

class VerificationStatus(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    PENDING_REVIEW = "PENDING_REVIEW"
    VERIFIED_EFFECTIVE = "VERIFIED_EFFECTIVE"
    FAILED_VERIFICATION = "FAILED_VERIFICATION"

class RemediationActionRecord(Base, UUIDMixin, TimestampMixin):
    """
    Manages the continuous governance lifecycle of a remediation action
    from gap detection through implementation fix, evidence upload, automated reassessment, and verified closure.
    """
    __tablename__ = "remediation_action_records"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_systems.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    assessment_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )
    finding_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    requirement_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    framework: Mapped[str] = mapped_column(String(200), nullable=False)
    clause: Mapped[str] = mapped_column(String(200), nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Multi-tier Ownership
    owner_type: Mapped[OwnerType] = mapped_column(
        Enum(OwnerType, name="owner_type_enum"),
        nullable=False,
        default=OwnerType.INDIVIDUAL
    )
    owner_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    owner_name: Mapped[str] = mapped_column(String(150), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False, default="AI Governance")

    # Priority & Status
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")
    status: Mapped[ActionStatus] = mapped_column(
        Enum(ActionStatus, name="action_status_enum"),
        nullable=False,
        default=ActionStatus.OPEN
    )

    # Dates
    due_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    completed_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Evidence Requirements & Uploaded Artifacts
    evidence_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    evidence_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evidence_ids: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)

    # Verification Protocol
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, name="verification_status_enum"),
        nullable=False,
        default=VerificationStatus.UNVERIFIED
    )
    verified_by: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    verified_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    verification_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Reassessment Impact
    reassessment_score_delta: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0.0)
    reassessment_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    __table_args__ = (
        Index("idx_remediation_proj_status", "project_id", "status"),
        Index("idx_remediation_owner", "owner_name", "department"),
    )

    def __repr__(self) -> str:
        return f"<RemediationActionRecord(id='{self.id}', title='{self.title}', status='{self.status}')>"
