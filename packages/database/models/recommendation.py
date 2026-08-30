import enum
import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.assessment import Assessment
    from models.compliance import ComplianceFinding

class PriorityLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class Recommendation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "recommendations"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    compliance_finding_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("compliance_findings.id", ondelete="CASCADE"),
        nullable=False
    )
    priority: Mapped[PriorityLevel] = mapped_column(
        Enum(PriorityLevel, name="priority_level_enum"),
        nullable=False,
        default=PriorityLevel.MEDIUM
    )
    remediation_title: Mapped[str] = mapped_column(String(255), nullable=False)
    action_plan: Mapped[str] = mapped_column(Text, nullable=False)
    target_framework_clause: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="recommendations")
    finding: Mapped["ComplianceFinding"] = relationship("ComplianceFinding", back_populates="recommendations")

    def __repr__(self) -> str:
        return f"<Recommendation(priority='{self.priority}', title='{self.remediation_title}')>"
