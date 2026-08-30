import enum
import uuid
import hashlib
import json
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional, Dict, Any
from sqlalchemy import String, Text, ForeignKey, Index, Enum, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from models.base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from models.organization import Organization
    from models.user import User
    from models.ai_system import AISystem
    from models.assessment import Assessment

class AuditEventType(str, enum.Enum):
    USER_LOGIN = "USER_LOGIN"
    DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED"
    DOCUMENT_DELETED = "DOCUMENT_DELETED"
    DOCUMENT_PROCESSED = "DOCUMENT_PROCESSED"
    ASSESSMENT_CREATED = "ASSESSMENT_CREATED"
    ASSESSMENT_STARTED = "ASSESSMENT_STARTED"
    ASSESSMENT_COMPLETED = "ASSESSMENT_COMPLETED"
    REQUIREMENT_RETRIEVED = "REQUIREMENT_RETRIEVED"
    FINDING_CREATED = "FINDING_CREATED"
    FINDING_UPDATED = "FINDING_UPDATED"
    FINDING_RESOLVED = "FINDING_RESOLVED"
    EVIDENCE_ADDED = "EVIDENCE_ADDED"
    ACTION_CREATED = "ACTION_CREATED"
    ACTION_ASSIGNED = "ACTION_ASSIGNED"
    ACTION_COMPLETED = "ACTION_COMPLETED"
    POLICY_UPDATED = "POLICY_UPDATED"
    ASSESSMENT_VERSION_CREATED = "ASSESSMENT_VERSION_CREATED"
    ASSESSMENT_COMPARED = "ASSESSMENT_COMPARED"
    REPORT_GENERATED = "REPORT_GENERATED"
    SCORE_CALCULATED = "SCORE_CALCULATED"
    AGENT_EXECUTED = "AGENT_EXECUTED"
    MODEL_EXECUTED = "MODEL_EXECUTED"
    HUMAN_OVERRIDE = "HUMAN_OVERRIDE"

class ActorType(str, enum.Enum):
    USER = "USER"
    AGENT = "AGENT"
    SYSTEM = "SYSTEM"
    AUTOMATION = "AUTOMATION"

class AuditEventRecord(Base, UUIDMixin, TimestampMixin):
    """
    Enterprise-Grade Append-Only, Tamper-Evident Audit Event Record.
    Each record links cryptographically to the previous event via SHA-256 hash chaining.
    """
    __tablename__ = "audit_event_records"

    # Event Classification
    event_type: Mapped[AuditEventType] = mapped_column(
        Enum(AuditEventType, name="audit_event_type_enum"),
        nullable=False,
        index=True
    )
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="INFO") # CRITICAL, HIGH, MEDIUM, LOW, INFO
    system_component: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. RAG_ENGINE, AGENT_ORCHESTRATOR, SCORING_ENGINE, API_GATEWAY, WEB_UI

    # Actor Details
    actor_type: Mapped[ActorType] = mapped_column(
        Enum(ActorType, name="actor_type_enum"),
        nullable=False,
        default=ActorType.USER
    )
    actor_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    actor_name: Mapped[str] = mapped_column(String(150), nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Scope & Entity References
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="SET NULL"),
        nullable=True
    )
    project_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_systems.id", ondelete="SET NULL"),
        nullable=True
    )
    project_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    assessment_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="SET NULL"),
        nullable=True
    )
    assessment_version: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Human-Readable Summary
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    # State Mutations (Previous State vs New State)
    previous_state: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    new_state: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    # Specialized Execution Payloads
    ai_execution_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    # Stores: agent_name, agent_version, model_provider, model_name, model_version, prompt_version,
    # retrieval_configuration, knowledge_base_version, input_reference (SHA-256), output_reference,
    # timestamp, execution_status, latency_ms, token_count

    human_override_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    # Stores: original_status, new_status, reason, user, timestamp, external_evidence_id

    # Cryptographic Tamper-Evidence Chaining
    event_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    previous_event_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    __table_args__ = (
        Index("idx_audit_event_project", "project_id", "created_at"),
        Index("idx_audit_event_assessment", "assessment_id", "created_at"),
        Index("idx_audit_event_type_ts", "event_type", "created_at"),
        Index("idx_audit_event_hash", "event_hash", unique=True),
    )

    def calculate_hash(self, prev_hash: str) -> str:
        """Computes SHA-256 hash chaining over the canonical event payload."""
        payload = {
            "prev_hash": prev_hash,
            "seq": self.sequence_number,
            "event_type": self.event_type.value if isinstance(self.event_type, AuditEventType) else str(self.event_type),
            "actor_id": self.actor_id,
            "actor_name": self.actor_name,
            "system_component": self.system_component,
            "project_id": str(self.project_id) if self.project_id else None,
            "assessment_id": str(self.assessment_id) if self.assessment_id else None,
            "summary": self.summary,
            "previous_state": self.previous_state,
            "new_state": self.new_state,
            "ai_execution_data": self.ai_execution_data,
            "human_override_data": self.human_override_data,
        }
        serialized = json.dumps(payload, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def __repr__(self) -> str:
        return f"<AuditEventRecord(seq={self.sequence_number}, event='{self.event_type}', actor='{self.actor_name}', hash='{self.event_hash[:8]}...')>"


class AuditLog(Base, UUIDMixin, TimestampMixin):
    """Legacy audit log model preserved for backward compatibility."""
    __tablename__ = "audit_logs"

    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="SET NULL"),
        nullable=True
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    organization: Mapped[Optional["Organization"]] = relationship("Organization", back_populates="audit_logs")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        Index("idx_audit_org_timestamp", "organization_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<AuditLog(action='{self.action}', user_id={self.user_id})>"
