import enum
import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Text, Integer, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin
from models.assessment import OverallRiskLevel

if TYPE_CHECKING:
    from models.compliance import ComplianceFinding
    from models.document import UploadedDocument

class AnnotationType(str, enum.Enum):
    COMPLIANCE_VIOLATION = "compliance_violation" # 🔴 Red
    RISK = "risk"                                 # 🟠 Orange
    WARNING = "warning"                           # 🟡 Yellow
    COMPLIANT_EVIDENCE = "compliant_evidence"     # 🟢 Green

class EvidenceAnnotation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "evidence_annotations"

    finding_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("compliance_findings.id", ondelete="CASCADE"),
        nullable=False
    )
    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("uploaded_documents.id", ondelete="CASCADE"),
        nullable=False
    )
    page_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    extracted_text: Mapped[str] = mapped_column(Text, nullable=False)
    start_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    end_position: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    annotation_type: Mapped[AnnotationType] = mapped_column(
        Enum(AnnotationType, name="annotation_type_enum"),
        nullable=False,
        default=AnnotationType.COMPLIANCE_VIOLATION
    )
    severity: Mapped[OverallRiskLevel] = mapped_column(
        Enum(OverallRiskLevel, name="overall_risk_level_enum"),
        nullable=False,
        default=OverallRiskLevel.HIGH
    )
    ai_comment: Mapped[str] = mapped_column(Text, nullable=False)
    requirement_reference: Mapped[str] = mapped_column(String(255), nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    bounding_box: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True) # { "x0": 120, "y0": 350, "x1": 500, "y1": 380 }

    # Relationships
    finding: Mapped["ComplianceFinding"] = relationship("ComplianceFinding")
    document: Mapped["UploadedDocument"] = relationship("UploadedDocument")

    __table_args__ = (
        Index("idx_annotations_finding", "finding_id"),
        Index("idx_annotations_doc_page", "document_id", "page_number"),
    )

    def __repr__(self) -> str:
        return f"<EvidenceAnnotation(finding_id={self.finding_id}, page={self.page_number}, type='{self.annotation_type}')>"
