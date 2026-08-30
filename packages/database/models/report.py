import enum
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.assessment import Assessment

class ReportFormat(str, enum.Enum):
    PDF = "pdf"
    DOCX = "docx"
    JSON = "json"

class GeneratedReport(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "generated_reports"

    assessment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )
    report_title: Mapped[str] = mapped_column(String(255), nullable=False)
    format: Mapped[ReportFormat] = mapped_column(
        Enum(ReportFormat, name="report_format_enum"),
        nullable=False
    )
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    cryptographic_sha256: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    # Relationship
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="generated_reports")

    def __repr__(self) -> str:
        return f"<GeneratedReport(title='{self.report_title}', format='{self.format}')>"
