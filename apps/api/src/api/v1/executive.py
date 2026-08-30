"""
AI Guardian — Executive Dashboard API Router
Provides REST endpoints for board-ready executive posture, KPIs, historical trends,
top ranked risks with evidence links, and prioritized executive recommendations.
"""

from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel

from src.core.executive.executive_service import executive_governance_service

router = APIRouter()

@router.get("/posture", summary="Get Executive Governance Posture")
async def get_executive_posture(project_id: str = Query("sys-fintrust-001", description="AI System Project ID")):
    """
    Returns high-level executive KPIs, risk rating, historical score trends,
    top ranked risks linked to evidence, and executive recommendations.
    """
    data = executive_governance_service.get_executive_posture(project_id=project_id)
    return {
        "status": "SUCCESS",
        "project_id": project_id,
        "data": data
    }
