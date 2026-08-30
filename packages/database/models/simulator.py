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

class AdversarialScenarioCategory(str, enum.Enum):
    DATA_LEAKAGE = "DATA_LEAKAGE"
    MODEL_MANIPULATION = "MODEL_MANIPULATION"
    BIAS_DISCRIMINATION = "BIAS_DISCRIMINATION"
    VENDOR_FAILURE = "VENDOR_FAILURE"
    HUMAN_OVERSIGHT_FAILURE = "HUMAN_OVERSIGHT_FAILURE"
    REGULATORY_CHANGE = "REGULATORY_CHANGE"
    SECURITY_FAILURE = "SECURITY_FAILURE"
    MONITORING_FAILURE = "MONITORING_FAILURE"
    DOCUMENTATION_FAILURE = "DOCUMENTATION_FAILURE"
    GOVERNANCE_FAILURE = "GOVERNANCE_FAILURE"

class AdversarialScenarioRecord(Base, UUIDMixin, TimestampMixin):
    """
    Stores explainable adversarial failure scenarios grounded in assessment findings,
    regulatory requirements, evidence artifacts, and quantitative risk metrics.
    """
    __tablename__ = "adversarial_scenario_records"

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

    scenario_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    risk_category: Mapped[AdversarialScenarioCategory] = mapped_column(
        Enum(AdversarialScenarioCategory, name="adversarial_scenario_category_enum"),
        nullable=False,
        default=AdversarialScenarioCategory.GOVERNANCE_FAILURE
    )
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")

    # Grounding & Provenance
    trigger_conditions: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    related_findings: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    related_requirements: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    related_evidence: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)

    # Risk Simulation Quantification
    likelihood_score: Mapped[int] = mapped_column(Integer, nullable=False, default=3) # 1 - 5
    impact_score: Mapped[int] = mapped_column(Integer, nullable=False, default=4) # 1 - 5
    inherent_risk_score: Mapped[int] = mapped_column(Integer, nullable=False, default=12) # 1 - 25
    existing_controls: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)
    control_effectiveness_pct: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=50.0)
    residual_risk_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=6.0)

    # Remediation & Mitigations
    mitigations: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)
    confidence: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False, default=0.95)
    generated_by: Mapped[str] = mapped_column(String(150), nullable=False, default="DevilsAdvocateSimulator v2.4")
    is_simulated: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        Index("idx_adv_proj_cat", "project_id", "risk_category"),
    )

    def __repr__(self) -> str:
        return f"<AdversarialScenarioRecord(id='{self.scenario_id}', title='{self.title}', cat='{self.risk_category}')>"
