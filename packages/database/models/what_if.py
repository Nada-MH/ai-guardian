import enum
import uuid
from typing import TYPE_CHECKING, Optional, Dict, Any, List
from sqlalchemy import String, Text, ForeignKey, Index, Enum, Integer, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.ai_system import AISystem
    from models.assessment import Assessment

class ConfidenceLevel(str, enum.Enum):
    HIGH_CONFIDENCE = "HIGH_CONFIDENCE"
    MEDIUM_CONFIDENCE = "MEDIUM_CONFIDENCE"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"

class GovernanceMaturityStage(str, enum.Enum):
    BASELINE = "BASELINE"
    POLICY_ONLY = "POLICY_ONLY"
    POLICY_AND_CONTROL = "POLICY_AND_CONTROL"
    POLICY_CONTROL_MONITORING = "POLICY_CONTROL_MONITORING"

class WhatIfSimulationRecord(Base, UUIDMixin, TimestampMixin):
    """
    Stores explainable, assumption-driven What-If simulations calculated
    via the deterministic scoring engine.
    """
    __tablename__ = "what_if_simulation_records"

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

    simulation_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    proposed_changes: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    affected_requirements: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    affected_controls: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    assumptions: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)

    # Deterministic Projection Metrics
    baseline_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=71.0)
    projected_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=86.0)
    estimated_improvement: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=15.0)

    # Uncertainty & Confidence Band
    confidence_level: Mapped[ConfidenceLevel] = mapped_column(
        Enum(ConfidenceLevel, name="confidence_level_enum"),
        nullable=False,
        default=ConfidenceLevel.MEDIUM_CONFIDENCE
    )
    confidence_pct: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False, default=78.0)
    confidence_rationale: Mapped[str] = mapped_column(Text, nullable=False)

    affected_findings: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    affected_risk_level: Mapped[Dict[str, str]] = mapped_column(JSONB, nullable=False, default=dict)
    progressive_stages: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)

    disclaimer: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="Projected improvement under stated assumptions. Not a guaranteed outcome."
    )

    __table_args__ = (
        Index("idx_wif_proj_conf", "project_id", "confidence_level"),
    )

    def __repr__(self) -> str:
        return f"<WhatIfSimulationRecord(id='{self.simulation_id}', title='{self.title}', gain='+{self.estimated_improvement}%')>"
