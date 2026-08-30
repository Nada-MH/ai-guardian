"""
AI Guardian — AI Evaluation & Quality Assurance API Router
Provides endpoints to trigger live benchmark evaluations, list historical runs,
and inspect empirical accuracy, grounding, retrieval, and regression metrics.
"""

from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Query, HTTPException, status

from src.core.evaluation.evaluation_engine import ai_evaluation_engine

router = APIRouter()

class RunLiveEvaluationRequest(BaseModel):
    target_component: Optional[str] = Field("ComplianceEvaluationAgent v2.4.0", description="Component or agent being evaluated")
    triggered_by: Optional[str] = Field("AI Governance Officer", description="User or pipeline triggering the evaluation")
    trigger_reason: Optional[str] = Field("Pre-deployment regression validation", description="Rationale for evaluation trigger")

@router.get("/runs", summary="List All Evaluation Runs")
async def get_evaluation_runs():
    """Returns historical evaluation runs with quality scores and regression status."""
    runs = ai_evaluation_engine.get_evaluation_runs()
    return {
        "status": "SUCCESS",
        "total_runs": len(runs),
        "latest_run": runs[-1] if runs else None,
        "runs": runs
    }

@router.get("/runs/{run_id}", summary="Get Specific Evaluation Run Details")
async def get_evaluation_run(run_id: str):
    """Returns detailed metric breakdown and individual test case results for a run."""
    runs = ai_evaluation_engine.get_evaluation_runs()
    target = next((r for r in runs if r["run_id"] == run_id), None)
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation run '{run_id}' not found."
        )
    return {
        "status": "SUCCESS",
        "run": target
    }

@router.get("/benchmark-dataset", summary="Get Ground-Truth Benchmark Dataset")
async def get_benchmark_dataset():
    """Returns curated multi-jurisdiction benchmark test cases."""
    return {
        "status": "SUCCESS",
        "test_cases": ai_evaluation_engine.get_benchmark_dataset()
    }

@router.post("/run", summary="Trigger Live Evaluation Benchmark Suite")
async def trigger_evaluation(req: RunLiveEvaluationRequest):
    """
    Executes live evaluation against benchmark dataset and returns empirical quality scores.
    """
    new_run = ai_evaluation_engine.run_live_evaluation(
        target_component=req.target_component,
        triggered_by=req.triggered_by,
        trigger_reason=req.trigger_reason
    )
    return {
        "status": "SUCCESS",
        "message": f"Evaluation Run #{new_run['run_number']} completed successfully.",
        "run": new_run
    }

@router.get("/regression-comparison", summary="Compare Two Evaluation Runs for Regressions")
async def compare_evaluation_runs(
    run_a: str = Query("RUN-2026-08-023", description="Baseline evaluation run ID"),
    run_b: str = Query("RUN-2026-08-024", description="Target evaluation run ID")
):
    """Computes regression delta between baseline and target evaluation runs."""
    diff = ai_evaluation_engine.compare_runs(run_a, run_b)
    return {
        "status": "SUCCESS",
        "comparison": diff
    }
