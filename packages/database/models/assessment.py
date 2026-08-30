import enum
import uuid
from datetime import datetime
from typing import List, TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Numeric, Enum, ForeignKey, DateTime, Integer, Index, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.ai_system import AISystem
    from models.user import User
    from models.compliance import ComplianceCriteria, ComplianceFinding
    from models.risk import RiskScore
    from models.recommendation import Recommendation
    from models.report import GeneratedReport

class AssessmentType(str, enum.Enum):
    FULL_GOVERNANCE_AUDIT = "full_governance_audit"
    SAMA_COMPLIANCE_CHECK = "sama_compliance_check"
    MRM_VALIDATION = "mrm_validation"
    RAPID_GAP_ANALYSIS = "rapid_gap_analysis"

class AssessmentStatus(str, enum.Enum):
    QUEUED = "queued"
    PARSING_DOCS = "parsing_docs"
    RETRIEVING_RULES = "retrieving_rules"
    EVALUATING_AGENTS = "evaluating_agents"
    CALCULATING_SCORES = "calculating_scores"
    COMPLETED = "completed"
    FAILED = "failed"

class OverallRiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class RetrievalLayer(str, enum.Enum):
    CORE_GOVERNANCE = "core_governance"
    FINANCE_REGULATORY = "finance_regulatory"
    UPLOADED_DOC = "uploaded_doc"

class Assessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "assessments"

    ai_system_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_systems.id", ondelete="CASCADE"),
        nullable=False
    )
    initiated_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    assessment_type: Mapped[AssessmentType] = mapped_column(
        Enum(AssessmentType, name="assessment_type_enum"),
        nullable=False,
        default=AssessmentType.FULL_GOVERNANCE_AUDIT
    )
    status: Mapped[AssessmentStatus] = mapped_column(
        Enum(AssessmentStatus, name="assessment_status_enum"),
        nullable=False,
        default=AssessmentStatus.QUEUED
    )
    overall_compliance_score: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True) # 0.00 to 100.00%
    risk_level: Mapped[Optional[OverallRiskLevel]] = mapped_column(
        Enum(OverallRiskLevel, name="overall_risk_level_enum"),
        nullable=True
    )

    # Immutability & Versioning Metadata
    version_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    is_current_version: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    previous_version_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="SET NULL"),
        nullable=True
    )
    knowledge_base_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1.4.2-provenance")
    scoring_engine_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1.0.0-deterministic")
    agent_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v2.1.0-multiagent")
    model_version: Mapped[str] = mapped_column(String(100), nullable=False, default="gemini-1.5-pro")

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    ai_system: Mapped["AISystem"] = relationship("AISystem", back_populates="assessments")
    initiated_by_user: Mapped[Optional["User"]] = relationship("User", back_populates="initiated_assessments")
    findings: Mapped[List["ComplianceFinding"]] = relationship("ComplianceFinding", back_populates="assessment", cascade="all, delete-orphan")
    retrieved_evidences: Mapped[List["RetrievedEvidence"]] = relationship("RetrievedEvidence", back_populates="assessment", cascade="all, delete-orphan")
    agent_outputs: Mapped[List["AgentOutput"]] = relationship("AgentOutput", back_populates="assessment", cascade="all, delete-orphan")
    risk_scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="assessment", cascade="all, delete-orphan")
    recommendations: Mapped[List["Recommendation"]] = relationship("Recommendation", back_populates="assessment", cascade="all, delete-orphan")
    generated_reports: Mapped[List["GeneratedReport"]] = relationship("GeneratedReport", back_populates="assessment", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_assessments_system_status", "ai_system_id", "status"),
        Index("idx_assessments_version", "ai_system_id", "version_number"),
    )

    def __repr__(self) -> str:
        return f"<Assessment(id={self.id}, v={self.version_number}, status='{self.status}', score={self.overall_compliance_score}%)>"


class AssessmentComparisonRecord(Base, UUIDMixin, TimestampMixin):
    """
    Immutable diff record between two assessment versions (v1 -> v2).
    Tracks resolved, new, improved, regressed, and unchanged findings.
    """
    __tablename__ = "assessment_comparison_records"

    base_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    target_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    score_base: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_target: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_delta: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    risk_transition: Mapped[str] = mapped_column(String(50), nullable=False)

    resolved_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    new_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    improved_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    regressed_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    unchanged_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    regulatory_coverage_base: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0.0)
    regulatory_coverage_target: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0.0)

    finding_transitions: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    metrics_diff: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    base_assessment: Mapped["Assessment"] = relationship("Assessment", foreign_keys=[base_version_id])
    target_assessment: Mapped["Assessment"] = relationship("Assessment", foreign_keys=[target_version_id])

    def __repr__(self) -> str:
        return f"<AssessmentComparisonRecord(base={self.base_version_id}, target={self.target_version_id}, delta={self.score_delta:+.1f}%)>"


class RetrievedEvidence(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "retrieved_evidence"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    compliance_criteria_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("compliance_criteria.id", ondelete="CASCADE"),
        nullable=False
    )
    uploaded_document_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("uploaded_documents.id", ondelete="SET NULL"),
        nullable=True
    )
    retrieved_text_chunk: Mapped[str] = mapped_column(Text, nullable=False)
    source_reference: Mapped[str] = mapped_column(String(255), nullable=False)
    similarity_score: Mapped[float] = mapped_column(Numeric(4, 3), nullable=False)
    retrieval_layer: Mapped[RetrievalLayer] = mapped_column(
        Enum(RetrievalLayer, name="retrieval_layer_enum"),
        nullable=False
    )

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="retrieved_evidences")
    criteria: Mapped["ComplianceCriteria"] = relationship("ComplianceCriteria", back_populates="evidences")

    def __repr__(self) -> str:
        return f"<RetrievedEvidence(id={self.id}, similarity={self.similarity_score})>"


class AgentOutput(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "agent_outputs"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    output_payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    execution_time_ms: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationship
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="agent_outputs")

    def __repr__(self) -> str:
        return f"<AgentOutput(agent='{self.agent_name}', step={self.step_number})>"
