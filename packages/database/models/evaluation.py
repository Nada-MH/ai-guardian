import enum
import uuid
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Text, ForeignKey, Index, Enum, Integer, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from models.base import Base, UUIDMixin, TimestampMixin

class EvaluationRunStatus(str, enum.Enum):
    COMPLETED_PASS = "COMPLETED_PASS"
    REGRESSION_DETECTED = "REGRESSION_DETECTED"
    RUNNING = "RUNNING"
    FAILED = "FAILED"

class EvaluationRunRecord(Base, UUIDMixin, TimestampMixin):
    """
    Immutable evaluation run execution measuring AI Guardian's reasoning accuracy,
    retrieval quality, evidence grounding, and regression status.
    """
    __tablename__ = "evaluation_run_records"

    run_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    run_number: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    status: Mapped[EvaluationRunStatus] = mapped_column(
        Enum(EvaluationRunStatus, name="evaluation_run_status_enum"),
        nullable=False,
        default=EvaluationRunStatus.COMPLETED_PASS
    )
    triggered_by: Mapped[str] = mapped_column(String(150), nullable=False)
    trigger_reason: Mapped[str] = mapped_column(Text, nullable=False)
    target_component: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "ComplianceEvaluationAgent v2.4"
    total_test_cases: Mapped[int] = mapped_column(Integer, nullable=False)
    passed_test_cases: Mapped[int] = mapped_column(Integer, nullable=False)
    failed_test_cases: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    overall_quality_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    
    # 4-Category Metrics stored as structured JSON
    retrieval_metrics: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    evidence_metrics: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    compliance_metrics: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    ai_quality_metrics: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    
    regression_detected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    regression_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)

    def __repr__(self) -> str:
        return f"<EvaluationRunRecord(run_id='{self.run_id}', num={self.run_number}, score={self.overall_quality_score}%)>"

class EvaluationTestCaseRecord(Base, UUIDMixin, TimestampMixin):
    """
    Curated ground-truth test case for AI Guardian quality benchmarking.
    """
    __tablename__ = "evaluation_test_cases"

    test_case_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False)
    scenario: Mapped[Text] = mapped_column(Text, nullable=False)
    documents: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, nullable=False)
    expected_requirements: Mapped[List[str]] = mapped_column(JSONB, nullable=False)
    expected_findings: Mapped[List[str]] = mapped_column(JSONB, nullable=False)
    expected_status: Mapped[str] = mapped_column(String(50), nullable=False) # COMPLIANT, NON_COMPLIANT, etc.
    expected_citations: Mapped[List[str]] = mapped_column(JSONB, nullable=False)
    expected_risk: Mapped[str] = mapped_column(String(20), nullable=False)
    expected_score_min: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    expected_score_max: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    def __repr__(self) -> str:
        return f"<EvaluationTestCaseRecord(id='{self.test_case_id}', name='{self.name}')>"
