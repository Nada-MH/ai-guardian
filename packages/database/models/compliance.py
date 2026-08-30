import enum
import uuid
from typing import List, TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Boolean, Numeric, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.assessment import Assessment, RetrievedEvidence
    from models.recommendation import Recommendation
    from models.provenance import RegulatoryRequirement

class KnowledgeCategory(str, enum.Enum):
    CORE_AI_GOVERNANCE = "core_ai_governance"
    FINANCE_REGULATORY = "finance_regulatory"
    CUSTOM_ORG_POLICY = "custom_org_policy"

class RiskDomain(str, enum.Enum):
    MODEL_GOVERNANCE = "model_governance"
    BIAS_FAIRNESS = "bias_fairness"
    EXPLAINABILITY = "explainability"
    DATA_GOVERNANCE = "data_governance"
    PRIVACY = "privacy"
    CYBERSECURITY = "cybersecurity"
    REGULATORY_COMPLIANCE = "regulatory_compliance"
    RISK_MANAGEMENT = "risk_management"
    HUMAN_OVERSIGHT = "human_oversight"
    THIRD_PARTY_RISK = "third_party_risk"

class ComplianceStatus(str, enum.Enum):
    COMPLIANT = "compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    NON_COMPLIANT = "non_compliant"
    INSUFFICIENT_EVIDENCE = "insufficient_evidence"

class KnowledgeSource(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "knowledge_sources"

    source_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[KnowledgeCategory] = mapped_column(
        Enum(KnowledgeCategory, name="knowledge_category_enum"),
        nullable=False
    )
    publishing_body: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    criteria: Mapped[List["ComplianceCriteria"]] = relationship(
        "ComplianceCriteria", back_populates="knowledge_source", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<KnowledgeSource(code='{self.source_code}', title='{self.title}')>"


class ComplianceCriteria(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "compliance_criteria"

    knowledge_source_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("knowledge_sources.id", ondelete="CASCADE"),
        nullable=False
    )
    article_section: Mapped[str] = mapped_column(String(100), nullable=False)
    risk_domain: Mapped[RiskDomain] = mapped_column(
        Enum(RiskDomain, name="risk_domain_enum"),
        nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    requirement_text: Mapped[str] = mapped_column(Text, nullable=False)
    weight: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00, nullable=False)

    # Relationships
    knowledge_source: Mapped["KnowledgeSource"] = relationship("KnowledgeSource", back_populates="criteria")
    findings: Mapped[List["ComplianceFinding"]] = relationship("ComplianceFinding", back_populates="criteria")
    evidences: Mapped[List["RetrievedEvidence"]] = relationship("RetrievedEvidence", back_populates="criteria")

    __table_args__ = (
        Index("idx_criteria_source_domain", "knowledge_source_id", "risk_domain"),
    )

    def __repr__(self) -> str:
        return f"<ComplianceCriteria(id={self.id}, article='{self.article_section}', domain='{self.risk_domain}')>"


class ComplianceFinding(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "compliance_findings"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    compliance_criteria_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("compliance_criteria.id", ondelete="SET NULL"),
        nullable=True
    )
    regulatory_requirement_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regulatory_requirements.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    compliance_status: Mapped[ComplianceStatus] = mapped_column(
        Enum(ComplianceStatus, name="compliance_status_enum"),
        nullable=False
    )
    finding_summary: Mapped[str] = mapped_column(Text, nullable=False)
    detailed_analysis: Mapped[str] = mapped_column(Text, nullable=False)
    citations: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list) # List of document & regulatory quotes
    confidence_score: Mapped[float] = mapped_column(Numeric(3, 2), nullable=False, default=1.00)
    
    # Complete 8-point regulatory provenance snapshot
    provenance_metadata: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="findings")
    criteria: Mapped[Optional["ComplianceCriteria"]] = relationship("ComplianceCriteria", back_populates="findings")
    regulatory_requirement: Mapped[Optional["RegulatoryRequirement"]] = relationship("RegulatoryRequirement", back_populates="findings")
    recommendations: Mapped[List["Recommendation"]] = relationship("Recommendation", back_populates="finding", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_findings_assess_status", "assessment_id", "compliance_status"),
        Index("idx_findings_reg_req", "regulatory_requirement_id"),
    )

    def __repr__(self) -> str:
        return f"<ComplianceFinding(id={self.id}, status='{self.compliance_status}')>"
