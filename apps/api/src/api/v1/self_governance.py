"""
AI Guardian — Self-Governance API Router
Provides REST endpoints for inspecting AI Guardian's internal AI component registry,
prompt versioning, 9 AI risk controls, human oversight records, and self-assessment posture.
"""

from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status

from src.core.self_governance.self_governance_service import self_governance_service

router = APIRouter()

@router.get("/manifest", summary="Get Full Self-Governance Manifest")
async def get_manifest():
    """
    Returns AI Guardian's complete self-governance dossier answering:
    'How is AI Guardian itself governed?'
    """
    return {
        "status": "SUCCESS",
        "data": self_governance_service.get_self_governance_manifest()
    }

@router.get("/components", summary="Get AI Component Registry")
async def get_components():
    """Returns the internal AI models, providers, versions, and agent workers."""
    manifest = self_governance_service.get_self_governance_manifest()
    return {
        "status": "SUCCESS",
        "components": manifest["components"]
    }

@router.get("/prompts", summary="Get Prompt Version Registry")
async def get_prompts():
    """Returns immutable versioned prompt registry with cryptographic SHA-256 hashes."""
    manifest = self_governance_service.get_self_governance_manifest()
    return {
        "status": "SUCCESS",
        "prompts": manifest["prompts"]
    }

@router.get("/risk-controls", summary="Get 9 AI Risk Safeguard Controls")
async def get_risk_controls():
    """Returns active technical safeguards across hallucination, citation, bias, injection, etc."""
    manifest = self_governance_service.get_self_governance_manifest()
    return {
        "status": "SUCCESS",
        "risk_controls": manifest["risk_controls"]
    }

@router.get("/self-assessment", summary="Get AI Guardian Self-Assessment Results")
async def get_self_assessment():
    """Returns the self-assessment audit results of AI Guardian evaluating itself."""
    manifest = self_governance_service.get_self_governance_manifest()
    return {
        "status": "SUCCESS",
        "self_assessment": manifest["self_assessment"]
    }
