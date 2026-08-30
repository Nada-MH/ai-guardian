"""
AI Guardian — Observability & Telemetry API Router
"""

from fastapi import APIRouter
from src.core.observability.observability_service import observability_service

router = APIRouter()

@router.get("/health", summary="System Health Check")
async def get_health():
    """Returns runtime health status for all 12 platform subsystems."""
    return observability_service.get_system_health()

@router.get("/metrics", summary="Telemetry & Performance Metrics")
async def get_metrics():
    """Returns token usage, latencies, scoring variance, and QA regression status."""
    return observability_service.get_telemetry_metrics()
