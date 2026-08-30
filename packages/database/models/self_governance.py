import enum
import uuid
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Text, ForeignKey, Index, Enum, Integer, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from models.base import Base, UUIDMixin, TimestampMixin

class ComponentApprovalStatus(str, enum.Enum):
    APPROVED_FOR_PRODUCTION = "APPROVED_FOR_PRODUCTION"
    PENDING_VALIDATION = "PENDING_VALIDATION"
    REJECTED = "REJECTED"
    DEPRECATED = "DEPRECATED"

class PromptApprovalStatus(str, enum.Enum):
    APPROVED = "APPROVED"
    DRAFT = "DRAFT"
    SUPERSEDED = "SUPERSEDED"
    REJECTED = "REJECTED"

class AIRiskCategory(str, enum.Enum):
    HALLUCINATION = "HALLUCINATION"
    CITATION_ACCURACY = "CITATION_ACCURACY"
    BIAS = "BIAS"
    PROMPT_INJECTION = "PROMPT_INJECTION"
    DATA_LEAKAGE = "DATA_LEAKAGE"
    UNSAFE_OUTPUT = "UNSAFE_OUTPUT"
    MODEL_DRIFT = "MODEL_DRIFT"
    RETRIEVAL_FAILURES = "RETRIEVAL_FAILURES"
    INCORRECT_SCORING = "INCORRECT_SCORING"

class AIComponentRecord(Base, UUIDMixin, TimestampMixin):
    """
    Registry entry for AI Guardian's internal models, agents, and prompts.
    """
    __tablename__ = "ai_component_records"

    component_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Google Vertex AI", "Anthropic", "Groq"
    model: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "gemini-1.5-pro", "llama-3.3-70b"
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    agent_version: Mapped[str] = mapped_column(String(50), nullable=False)
    prompt_id: Mapped[str] = mapped_column(String(100), nullable=False)
    prompt_version: Mapped[str] = mapped_column(String(50), nullable=False)
    purpose: Mapped[str] = mapped_column(Text, nullable=False)
    data_used: Mapped[str] = mapped_column(Text, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False, default="MEDIUM")
    evaluation_status: Mapped[str] = mapped_column(String(50), nullable=False, default="BENCHMARKED_PASS")
    approval_status: Mapped[ComponentApprovalStatus] = mapped_column(
        Enum(ComponentApprovalStatus, name="component_approval_status_enum"),
        nullable=False,
        default=ComponentApprovalStatus.APPROVED_FOR_PRODUCTION
    )

    def __repr__(self) -> str:
        return f"<AIComponentRecord(id='{self.component_id}', name='{self.name}', model='{self.model}')>"

class PromptVersionRecord(Base, UUIDMixin, TimestampMixin):
    """
    Immutable versioned record of production prompts with cryptographic SHA-256 hash.
    """
    __tablename__ = "prompt_version_records"

    prompt_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    version: Mapped[str] = mapped_column(String(50), nullable=False)
    author: Mapped[str] = mapped_column(String(150), nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False) # SHA-256
    system_prompt_text: Mapped[str] = mapped_column(Text, nullable=False)
    change_reason: Mapped[str] = mapped_column(Text, nullable=False)
    approval_status: Mapped[PromptApprovalStatus] = mapped_column(
        Enum(PromptApprovalStatus, name="prompt_approval_status_enum"),
        nullable=False,
        default=PromptApprovalStatus.APPROVED
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        Index("idx_prompt_ver", "prompt_id", "version", unique=True),
    )

    def __repr__(self) -> str:
        return f"<PromptVersionRecord(id='{self.prompt_id}', version='{self.version}', hash='{self.content_hash[:8]}')>"

class AIRiskControlRecord(Base, UUIDMixin, TimestampMixin):
    """
    Safeguard control enforcing AI safety across the 9 risk vectors.
    """
    __tablename__ = "ai_risk_control_records"

    control_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    risk_category: Mapped[AIRiskCategory] = mapped_column(
        Enum(AIRiskCategory, name="ai_risk_category_enum"),
        nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    technical_mechanism: Mapped[str] = mapped_column(Text, nullable=False)
    enforcement_layer: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "RAG Pipeline", "Prompt Guard", "Scoring Engine"
    verification_method: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="ACTIVE_ENFORCING")

    def __repr__(self) -> str:
        return f"<AIRiskControlRecord(id='{self.control_id}', risk='{self.risk_category.value}', status='{self.status}')>"
