import enum
import uuid
from datetime import datetime, date
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Integer, Enum, ForeignKey, Date, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.compliance import ComplianceFinding, ComplianceCriteria

class SourceType(str, enum.Enum):
    """
    Distinct legal authority and governance classification for regulatory sources.
    Must NOT be treated as equivalent.
    """
    LAW = "LAW"                                 # Primary statutory legislation (e.g., Royal Decree, Act of Parliament)
    REGULATION = "REGULATION"                   # Binding regulatory rules issued by supervisory authority (e.g., SAMA CSF)
    REGULATORY_GUIDANCE = "REGULATORY_GUIDANCE" # Interpretive guidance & supervisory expectations (e.g., SAMA AI Guidance, SR 11-7)
    STANDARD = "STANDARD"                       # Formal technical standards (e.g., ISO/IEC 42001:2023, ISO 23894)
    FRAMEWORK = "FRAMEWORK"                     # Voluntary or national governance frameworks (e.g., NIST AI RMF, NDMO)
    ETHICS_PRINCIPLE = "ETHICS_PRINCIPLE"       # Ethical charters & AI principles (e.g., SDAIA AI Ethics, UNESCO, OECD)
    INTERNAL_POLICY = "INTERNAL_POLICY"         # Organization-specific governance policy or internal AI risk charter

class RegulatorySourceStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    DRAFT = "DRAFT"
    DEPRECATED = "DEPRECATED"

class RegulatorySource(Base, UUIDMixin, TimestampMixin):
    """
    Canonical regulatory source document metadata model with SHA-256 provenance tracking.
    """
    __tablename__ = "regulatory_sources"

    source_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True) # e.g. "SRC-SAMA-AI-2024"
    framework: Mapped[str] = mapped_column(String(255), nullable=False, index=True)              # e.g. "SAMA AI Guidance"
    source_type: Mapped[SourceType] = mapped_column(
        Enum(SourceType, name="source_type_enum"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    issuing_organization: Mapped[str] = mapped_column(String(255), nullable=False, index=True)   # e.g. "Saudi Central Bank (SAMA)"
    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False, default="Saudi Arabia (KSA)") # e.g. "Saudi Arabia (KSA)", "Global"
    sector: Mapped[str] = mapped_column(String(100), nullable=False, default="Cross-Sector")     # e.g. "Banking & Finance"
    document_version: Mapped[str] = mapped_column(String(50), nullable=False, default="1.0")    # e.g. "2024.1", "Royal Decree M/19"
    publication_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    effective_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    document_hash: Mapped[str] = mapped_column(String(64), nullable=False)                        # SHA-256 hash of canonical text
    retrieved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    status: Mapped[RegulatorySourceStatus] = mapped_column(
        Enum(RegulatorySourceStatus, name="regulatory_source_status_enum"),
        nullable=False,
        default=RegulatorySourceStatus.ACTIVE
    )
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")

    # Relationships
    requirements: Mapped[List["RegulatoryRequirement"]] = relationship(
        "RegulatoryRequirement", back_populates="source", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_reg_source_type_org", "source_type", "issuing_organization"),
        Index("idx_reg_source_hash", "document_hash"),
    )

    def __repr__(self) -> str:
        return f"<RegulatorySource(source_id='{self.source_id}', type='{self.source_type}', title='{self.title}')>"


class RegulatoryRequirement(Base, UUIDMixin, TimestampMixin):
    """
    Individual regulatory requirement/clause with independent versioning and lineage tracking.
    Changes create a new version row rather than silently overwriting the previous requirement.
    """
    __tablename__ = "regulatory_requirements"

    requirement_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True) # e.g. "REQ-SAMA-AI-5.3"
    source_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regulatory_sources.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    section: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)          # e.g. "Section 5: Model Validation"
    article: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)          # e.g. "Article 13"
    clause: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)           # e.g. "Clause 5.3.1"
    requirement_text: Mapped[str] = mapped_column(Text, nullable=False)

    # Independent Versioning Lineage
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    previous_version_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("regulatory_requirements.id", ondelete="SET NULL"),
        nullable=True
    )
    is_current_version: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)

    effective_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    document_hash: Mapped[str] = mapped_column(String(64), nullable=False)               # SHA-256 hash of requirement text
    retrieved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ACTIVE")
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")

    # Relationships
    source: Mapped["RegulatorySource"] = relationship("RegulatorySource", back_populates="requirements")
    previous_version: Mapped[Optional["RegulatoryRequirement"]] = relationship(
        "RegulatoryRequirement", remote_side="RegulatoryRequirement.id"
    )
    findings: Mapped[List["ComplianceFinding"]] = relationship("ComplianceFinding", back_populates="regulatory_requirement")

    __table_args__ = (
        Index("idx_req_lookup", "requirement_id", "is_current_version"),
        Index("idx_req_source_clause", "source_id", "clause"),
    )

    def __repr__(self) -> str:
        return f"<RegulatoryRequirement(req_id='{self.requirement_id}', v={self.version}, current={self.is_current_version})>"
