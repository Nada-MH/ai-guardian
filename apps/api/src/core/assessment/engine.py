"""Assessment engine: orchestrates the multi-agent evaluation pipeline."""
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "packages" / "database"))
from models.assessment import Assessment, AssessmentStatus

logger = logging.getLogger("ai_guardian.assessment_engine")

class AssessmentEngine:
    """State machine managing the lifecycle of a compliance assessment."""

    # Valid state transitions
    TRANSITIONS = {
        AssessmentStatus.QUEUED: [AssessmentStatus.PARSING_DOCS, AssessmentStatus.FAILED],
        AssessmentStatus.PARSING_DOCS: [AssessmentStatus.RETRIEVING_RULES, AssessmentStatus.FAILED],
        AssessmentStatus.RETRIEVING_RULES: [AssessmentStatus.EVALUATING_AGENTS, AssessmentStatus.FAILED],
        AssessmentStatus.EVALUATING_AGENTS: [AssessmentStatus.CALCULATING_SCORES, AssessmentStatus.FAILED],
        AssessmentStatus.CALCULATING_SCORES: [AssessmentStatus.COMPLETED, AssessmentStatus.FAILED],
        AssessmentStatus.COMPLETED: [],
        AssessmentStatus.FAILED: [AssessmentStatus.QUEUED],  # Allow retry
    }

    def __init__(self, db: AsyncSession):
        self.db = db

    async def transition(self, assessment: Assessment, new_status: AssessmentStatus) -> Assessment:
        """Transition assessment to a new state with validation."""
        allowed = self.TRANSITIONS.get(assessment.status, [])
        if new_status not in allowed:
            raise ValueError(
                f"Invalid state transition: {assessment.status.value} -> {new_status.value}. "
                f"Allowed: {[s.value for s in allowed]}"
            )

        assessment.status = new_status
        if new_status == AssessmentStatus.COMPLETED:
            assessment.completed_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(assessment)

        logger.info(f"Assessment {assessment.id}: transitioned to {new_status.value}")
        return assessment

    async def run_pipeline(self, assessment_id: uuid.UUID, config: Dict[str, Any]):
        """
        Execute the full assessment pipeline.
        Called by Celery worker task asynchronously.

        Pipeline stages:
        1. PARSING_DOCS    -> Document Processing Agent
        2. RETRIEVING_RULES -> Retrieval Agent + Governance Mapping Agent
        3. EVALUATING_AGENTS -> Compliance Evaluation Agent
        4. CALCULATING_SCORES -> Risk Assessment Agent + Recommendation Agent + Report Agent
        5. COMPLETED
        """
        # This method will be implemented when the multi-agent orchestrator is built (Step 6).
        # The orchestrator will call self.transition() at each stage boundary.
        logger.info(f"Assessment pipeline queued for: {assessment_id}")
        pass
