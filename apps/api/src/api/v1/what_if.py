"""
AI Guardian — Uncertainty-Aware What-If Simulator API Router
Provides REST endpoints for simulating hypothetical compliance changes using the deterministic scoring engine.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel, Field

from src.core.what_if.what_if_engine import uncertainty_what_if_engine

router = APIRouter()

class SimulateHypothesisRequest(BaseModel):
    title: str = "Implement Mandatory Human Review Workflow"
    proposed_changes: List[str]
    affected_requirement_ids: List[str]
    affected_controls: List[str]
    baseline_evaluations: List[Dict[str, Any]]
    baseline_findings: List[Dict[str, Any]]
    assumptions: Optional[List[Dict[str, Any]]] = None

@router.post("/simulate", summary="Run Uncertainty-Aware Deterministic What-If Simulation")
async def simulate_what_if(request: SimulateHypothesisRequest):
    """
    Simulates hypothetical compliance improvements using the deterministic scoring engine,
    evaluating explicit assumptions and calculating confidence bands.
    """
    result = uncertainty_what_if_engine.simulate_hypothesis(
        baseline_evaluations=request.baseline_evaluations,
        baseline_findings=request.baseline_findings,
        proposed_changes=request.proposed_changes,
        affected_requirement_ids=request.affected_requirement_ids,
        affected_controls=request.affected_controls,
        assumptions=request.assumptions,
        title=request.title
    )
    return {
        "status": "SIMULATED",
        "simulation": result
    }
