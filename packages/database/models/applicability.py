import enum
import uuid
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Numeric, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.assessment import Assessment
    from models.provenance import RegulatoryRequirement, RegulatorySource

class AssessmentProfile(Base, UUIDMixin, TimestampMixin):
    """
    Standardized AI System Assessment Profile containing 14 operational dimensions
    used by the Regulatory Applicability Engine to deterministically filter requirements.
    """
    __tablename__ = "assessment_profiles"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True
    )

    # 14 Operational Dimensions
    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False, default="Saudi Arabia (KSA)")
    sector: Mapped[str] = mapped_column(String(100), nullable=False, default="Banking & Finance")
    organization_type: Mapped[str] = mapped_column(String(100), nullable=False, default="Commercial Bank")
    ai_use_case: Mapped[str] = mapped_column(String(150), nullable=False, default="Credit Scoring & Loan Decisioning")
    system_purpose: Mapped[str] = mapped_column(Text, nullable=False)
    data_types: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["Personal Identity", "Credit History"]
    sensitive_data: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    deployment_stage: Mapped[str] = mapped_column(String(50), nullable=False, default="Production")
    production_status: Mapped[str] = mapped_column(String(50), nullable=False, default="Active in Production")
    decision_impact: Mapped[str] = mapped_column(String(100), nullable=False, default="High Impact (Binding Financial Denial/Approval)")
    affected_users: Mapped[str] = mapped_column(String(100), nullable=False, default="Retail Consumers / Public Citizens")
    human_oversight: Mapped[str] = mapped_column(String(100), nullable=False, default="Fully Autonomous (No Routine Human Review)")
    third_party_components: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")

    # Inferred provenance metadata tracking which dimensions were extracted from uploaded docs
    inferred_fields: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", backref="profile")

    def __repr__(self) -> str:
        return f"<AssessmentProfile(assessment_id='{self.assessment_id}', use_case='{self.ai_use_case}', jurisdiction='{self.jurisdiction}')>"


class RequirementApplicability(Base, UUIDMixin, TimestampMixin):
    """
    Deterministic requirement-level applicability evaluation decision record with transparent explainability.
    """
    __tablename__ = "requirement_applicabilities"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    regulatory_requirement_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regulatory_requirements.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    source_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    requirement_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    # Applicability Decision
    applicable: Mapped[bool] = mapped_column(Boolean, nullable=False, index=True)
    confidence: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False, default=1.00)

    # Explainability Lists
    applicability_reasons: Mapped[list] = mapped_column(JSONB, nullable=False, default=list) # e.g. ["✓ Jurisdiction = KSA", ...]
    exclusion_reasons: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)     # e.g. ["✗ Excluded: Healthcare regulation", ...]
    match_criteria: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment")
    requirement: Mapped["RegulatoryRequirement"] = relationship("RegulatoryRequirement")

    __table_args__ = (
        Index("idx_req_applicability_assessment", "assessment_id", "applicable"),
    )

    def __repr__(self) -> str:
        return f"<RequirementApplicability(req='{self.requirement_id}', applicable={self.applicable})>"
