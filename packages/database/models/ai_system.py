import enum
import uuid
from typing import List, TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Boolean, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.organization import Organization
    from models.user import User
    from models.document import UploadedDocument
    from models.assessment import Assessment

class FinancialUseCase(str, enum.Enum):
    CREDIT_SCORING = "credit_scoring"
    FRAUD_DETECTION = "fraud_detection"
    AML_TRANSACTION_MONITORING = "aml_transaction_monitoring"
    ALGORITHMIC_TRADING = "algorithmic_trading"
    ROBO_ADVISORY = "robo_advisory"
    UNDERWRITING = "underwriting"
    CUSTOMER_SERVICE_BOT = "customer_service_bot"
    OTHER = "other"

class CriticalityTier(str, enum.Enum):
    TIER_1_CRITICAL = "tier_1_critical"
    TIER_2_HIGH = "tier_2_high"
    TIER_3_MEDIUM = "tier_3_medium"
    TIER_4_LOW = "tier_4_low"

class DeploymentStatus(str, enum.Enum):
    DEVELOPMENT = "development"
    VALIDATION = "validation"
    STAGING = "staging"
    PRODUCTION = "production"
    DECOMMISSIONED = "decommissioned"

class AISystem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_systems"

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code_identifier: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    business_purpose: Mapped[str] = mapped_column(Text, nullable=False)
    financial_use_case: Mapped[FinancialUseCase] = mapped_column(
        Enum(FinancialUseCase, name="financial_use_case_enum"),
        nullable=False
    )
    criticality_tier: Mapped[CriticalityTier] = mapped_column(
        Enum(CriticalityTier, name="criticality_tier_enum"),
        nullable=False,
        default=CriticalityTier.TIER_2_HIGH
    )
    deployment_status: Mapped[DeploymentStatus] = mapped_column(
        Enum(DeploymentStatus, name="deployment_status_enum"),
        nullable=False,
        default=DeploymentStatus.DEVELOPMENT
    )
    owner_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="ai_systems")
    owner_user: Mapped[Optional["User"]] = relationship("User", back_populates="owned_ai_systems")
    models: Mapped[List["AIModel"]] = relationship("AIModel", back_populates="ai_system", cascade="all, delete-orphan")
    documents: Mapped[List["UploadedDocument"]] = relationship("UploadedDocument", back_populates="ai_system", cascade="all, delete-orphan")
    assessments: Mapped[List["Assessment"]] = relationship("Assessment", back_populates="ai_system", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_ai_systems_org_tier", "organization_id", "criticality_tier"),
    )

    def __repr__(self) -> str:
        return f"<AISystem(id={self.id}, code='{self.code_identifier}', tier='{self.criticality_tier}')>"


class AIModel(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_models"

    ai_system_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_systems.id", ondelete="CASCADE"),
        nullable=False
    )
    model_name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    algorithm_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_third_party: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    vendor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    training_data_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationship
    ai_system: Mapped["AISystem"] = relationship("AISystem", back_populates="models")

    def __repr__(self) -> str:
        return f"<AIModel(id={self.id}, name='{self.model_name}', version='{self.version}')>"
