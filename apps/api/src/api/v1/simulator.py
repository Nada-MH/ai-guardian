"""
AI Guardian — Explainable Adversarial Simulator API Router
Provides REST endpoints for retrieving grounded failure scenarios and simulating governance edge cases.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel, Field

from src.core.simulator.adversarial_simulator_engine import (
    adversarial_simulator_engine,
    SIMULATION_DISCLAIMER
)

router = APIRouter()

class GenerateScenarioRequest(BaseModel):
    title: str
    description: str
    category: str = "VENDOR_FAILURE"
    severity: str = "HIGH"
    trigger_conditions: List[str]
    related_findings: List[str]
    related_requirements: List[str]
    related_evidence: List[str] = Field(default_factory=list)
    likelihood_score: int = Field(3, ge=1, le=5)
    impact_score: int = Field(4, ge=1, le=5)
    existing_controls: List[str] = Field(default_factory=list)
    control_effectiveness_pct: float = Field(50.0, ge=0.0, le=100.0)
    mitigations: List[Dict[str, Any]] = Field(default_factory=list)

@router.get("/scenarios", summary="Get Grounded Adversarial Failure Scenarios")
async def get_adversarial_scenarios(
    category: Optional[str] = Query(None, description="Filter by risk category (DATA_LEAKAGE, VENDOR_FAILURE, etc.)"),
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)")
):
    """
    Returns explainable failure scenarios grounded in assessment findings,
    regulatory requirements, evidence, and quantitative risk metrics.
    """
    scenarios = adversarial_simulator_engine.get_canonical_grounded_scenarios()
    if category and category != "ALL":
        scenarios = [s for s in scenarios if s["risk_category"] == category]
    if severity and severity != "ALL":
        scenarios = [s for s in scenarios if s["severity"] == severity]

    return {
        "total_scenarios": len(scenarios),
        "disclaimer": SIMULATION_DISCLAIMER,
        "scenarios": scenarios
    }

@router.post("/generate-grounded", summary="Generate a New Grounded Adversarial Scenario")
async def generate_grounded_scenario(request: GenerateScenarioRequest):
    """
    Generates a new grounded adversarial scenario with quantitative risk calculations and provenance tracking.
    """
    scenario = adversarial_simulator_engine.create_grounded_scenario(
        title=request.title,
        description=request.description,
        category=request.category,
        severity=request.severity,
        trigger_conditions=request.trigger_conditions,
        related_findings=request.related_findings,
        related_requirements=request.related_requirements,
        related_evidence=request.related_evidence,
        likelihood_score=request.likelihood_score,
        impact_score=request.impact_score,
        existing_controls=request.existing_controls,
        control_effectiveness_pct=request.control_effectiveness_pct,
        mitigations=request.mitigations
    )
    return {
        "status": "GENERATED",
        "scenario": scenario
    }
