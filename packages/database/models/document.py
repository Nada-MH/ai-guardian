import enum
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String, Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.ai_system import AISystem

class DocumentCategory(str, enum.Enum):
    MODEL_ARCHITECTURE = "model_architecture"
    DATA_GOVERNANCE = "data_governance"
    VALIDATION_REPORT = "validation_report"
    BIAS_AUDIT = "bias_audit"
    CYBERSECURITY_SPEC = "cybersecurity_spec"
    THIRD_PARTY_CONTRACT = "third_party_contract"
    USER_MANUAL = "user_manual"

class ParsingStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UploadedDocument(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "uploaded_documents"

    ai_system_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_systems.id", ondelete="CASCADE"),
        nullable=False
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False) # pdf, docx, json, txt, csv
    document_category: Mapped[DocumentCategory] = mapped_column(
        Enum(DocumentCategory, name="document_category_enum"),
        nullable=False,
        default=DocumentCategory.MODEL_ARCHITECTURE
    )
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    file_hash_sha256: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    parsing_status: Mapped[ParsingStatus] = mapped_column(
        Enum(ParsingStatus, name="parsing_status_enum"),
        nullable=False,
        default=ParsingStatus.PENDING
    )

    # Relationships
    ai_system: Mapped["AISystem"] = relationship("AISystem", back_populates="documents")

    __table_args__ = (
        Index("idx_docs_system_category", "ai_system_id", "document_category"),
    )

    def __repr__(self) -> str:
        return f"<UploadedDocument(id={self.id}, name='{self.file_name}', status='{self.parsing_status}')>"
