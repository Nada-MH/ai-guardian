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

class LayerState(str, enum.Enum):
    PRESENT = "PRESENT"
    PARTIAL = "PARTIAL"
    MISSING = "MISSING"
    UNKNOWN = "UNKNOWN"

class OverallGapStatus(str, enum.Enum):
    COVERED = "COVERED"
    PARTIAL_COVERAGE = "PARTIAL_COVERAGE"
    EVIDENCE_GAP = "EVIDENCE_GAP"
    CONTROL_GAP = "CONTROL_GAP"
    POLICY_GAP = "POLICY_GAP"
    CRITICAL_GAP = "CRITICAL_GAP"
    MAJOR_GAP = "MAJOR_GAP"

class RequirementGapRecord(Base, UUIDMixin, TimestampMixin):
    """
    Tracks the 4-layer governance state of a regulatory requirement:
    Regulation -> Internal Policy -> Implementation Control -> Evidence
    """
    __tablename__ = "requirement_gap_records"

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

    requirement_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    framework: Mapped[str] = mapped_column(String(200), nullable=False)
    clause: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")

    # The 4 Discrete Governance Layer States
    regulation_state: Mapped[LayerState] = mapped_column(
        Enum(LayerState, name="layer_state_enum"),
        nullable=False,
        default=LayerState.PRESENT
    )
    policy_state: Mapped[LayerState] = mapped_column(
        Enum(LayerState, name="layer_state_enum", create_type=False),
        nullable=False,
        default=LayerState.UNKNOWN
    )
    control_state: Mapped[LayerState] = mapped_column(
        Enum(LayerState, name="layer_state_enum", create_type=False),
        nullable=False,
        default=LayerState.UNKNOWN
    )
    evidence_state: Mapped[LayerState] = mapped_column(
        Enum(LayerState, name="layer_state_enum", create_type=False),
        nullable=False,
        default=LayerState.UNKNOWN
    )

    # Overall Evaluated Gap State
    overall_gap_status: Mapped[OverallGapStatus] = mapped_column(
        Enum(OverallGapStatus, name="overall_gap_status_enum"),
        nullable=False,
        default=OverallGapStatus.CRITICAL_GAP
    )

    # Prioritization Score (0 - 100) and Rank
    prioritization_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0.0)
    priority_rank: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Detailed Layer Payloads
    regulation_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    policy_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    control_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    evidence_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    # Root Cause & Remediation Linkage
    broken_layer: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # e.g. "POLICY", "CONTROL", "EVIDENCE"
    remediation_action: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    remediation_owner: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    remediation_deadline: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    __table_args__ = (
        Index("idx_gap_proj_req", "project_id", "requirement_id"),
        Index("idx_gap_status_prio", "overall_gap_status", "prioritization_score"),
    )

    def __repr__(self) -> str:
        return f"<RequirementGapRecord(req='{self.requirement_id}', status='{self.overall_gap_status}', score={self.prioritization_score})>"
