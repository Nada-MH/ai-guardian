import enum
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Numeric, Enum, ForeignKey, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.assessment import Assessment
    from models.provenance import RegulatoryRequirement

class ComplianceEvidenceState(str, enum.Enum):
    """5 Primary Compliance Evidence States (INSUFFICIENT_EVIDENCE is distinct from NON_COMPLIANT)."""
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    PARTIALLY_COMPLIANT = "PARTIALLY_COMPLIANT"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class EvidenceStrength(str, enum.Enum):
    """4-Level Evidence Strength Classification."""
    STRONG = "STRONG"         # Direct technical proof (architecture spec, code, log, model card)
    MODERATE = "MODERATE"     # Operational policy documentation, process guidelines
    WEAK = "WEAK"             # Tangential or ambiguous mention
    NONE = "NONE"             # No evidence present in uploaded documents


class RequirementEvaluationRecord(Base, UUIDMixin, TimestampMixin):
    """
    Evaluation record for a specific regulatory requirement populated by the LLM agent.
    The LLM evaluates evidence and assigns states; it does NOT compute numeric scores.
    """
    __tablename__ = "requirement_evaluation_records"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    regulatory_requirement_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regulatory_requirements.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    requirement_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    framework: Mapped[str] = mapped_column(String(255), nullable=False)
    clause: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, default="governance")
    weight: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False, default=1.00)

    # Evidence Evaluation State
    status: Mapped[ComplianceEvidenceState] = mapped_column(
        Enum(ComplianceEvidenceState, name="compliance_evidence_state_enum"),
        nullable=False,
        default=ComplianceEvidenceState.INSUFFICIENT_EVIDENCE
    )
    evidence_strength: Mapped[EvidenceStrength] = mapped_column(
        Enum(EvidenceStrength, name="evidence_strength_enum"),
        nullable=False,
        default=EvidenceStrength.NONE
    )
    evidence_ids: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    evidence_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # e.g. "Architecture_Spec.pdf (Page 4, Sec 4.1)"
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False, default=1.00)
    review_required: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment")
    requirement: Mapped[Optional["RegulatoryRequirement"]] = relationship("RegulatoryRequirement")

    __table_args__ = (
        Index("idx_eval_assessment_status", "assessment_id", "status"),
    )

    def __repr__(self) -> str:
        return f"<RequirementEvaluationRecord(req='{self.requirement_id}', status='{self.status}', strength='{self.evidence_strength}')>"


class DeterministicScoreSnapshot(Base, UUIDMixin, TimestampMixin):
    """
    Immutable mathematical score snapshot produced by the Deterministic Scoring Engine.
    Guarantees reproducibility and audit integrity across scoring engine versions.
    """
    __tablename__ = "deterministic_score_snapshots"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Scoring Engine Metadata & Versioning
    scoring_engine_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1.0.0-deterministic")
    scoring_configuration_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v2026.1-standard")
    assessment_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1")
    calculation_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    # Final Computed Scores
    overall_compliance_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    overall_risk_level: Mapped[str] = mapped_column(String(20), nullable=False)

    # Mathematical Breakdown Payloads
    category_scores: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    penalties_applied: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    mathematical_proof: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Cryptographic Reproducibility Hash
    input_hash: Mapped[str] = mapped_column(String(64), nullable=False) # SHA-256 of all input evaluation states & weights

    # Relationship
    assessment: Mapped["Assessment"] = relationship("Assessment")

    def __repr__(self) -> str:
        return f"<DeterministicScoreSnapshot(assessment='{self.assessment_id}', score={self.overall_compliance_score}%, hash='{self.input_hash[:8]}...')>"
