import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.evidence_annotation import EvidenceAnnotation, AnnotationType

router = APIRouter()

class EvidenceAnnotationResponse(BaseModel):
    id: uuid.UUID
    finding_id: uuid.UUID
    document_id: uuid.UUID
    page_number: int
    extracted_text: str
    annotation_type: str
    severity: str
    ai_comment: str
    requirement_reference: str
    recommendation: str
    bounding_box: Optional[dict] = None

    class Config:
        from_attributes = True

@router.get("/findings/{finding_id}/evidence", response_model=EvidenceAnnotationResponse)
async def get_annotation_for_finding(
    finding_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve highlighted document evidence and AI comments for a specific compliance finding."""
    result = await db.execute(
        select(EvidenceAnnotation).where(EvidenceAnnotation.finding_id == finding_id)
    )
    annotation = result.scalar_one_or_none()
    if not annotation:
        # Fallback to returning "Evidence location unavailable" response if annotation doesn't exist
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence location unavailable for this finding",
        )
    return annotation

@router.get("/documents/{doc_id}/annotations", response_model=List[EvidenceAnnotationResponse])
async def list_annotations_for_document(
    doc_id: uuid.UUID,
    page: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all AI evidence annotations for a given document and optional page number."""
    query = select(EvidenceAnnotation).where(EvidenceAnnotation.document_id == doc_id)
    if page is not None:
        query = query.where(EvidenceAnnotation.page_number == page)

    result = await db.execute(query.order_by(EvidenceAnnotation.page_number.asc()))
    return result.scalars().all()
