import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Numeric, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin
from models.compliance import RiskDomain
from models.assessment import OverallRiskLevel

if TYPE_CHECKING:
    from models.assessment import Assessment

class RiskScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "risk_scores"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    risk_domain: Mapped[RiskDomain] = mapped_column(
        Enum(RiskDomain, name="risk_domain_enum"),
        nullable=False
    )
    score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False) # 0.00 to 100.00
    risk_level: Mapped[OverallRiskLevel] = mapped_column(
        Enum(OverallRiskLevel, name="overall_risk_level_enum"),
        nullable=False
    )
    key_contributing_factors: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)

    # Relationship
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="risk_scores")

    def __repr__(self) -> str:
        return f"<RiskScore(domain='{self.risk_domain}', score={self.score}, level='{self.risk_level}')>"
