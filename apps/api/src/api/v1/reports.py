import uuid
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path as FilePath

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user, require_compliance
from src.api.schemas import ReportGenerateRequest, ReportResponse

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.assessment import Assessment
from models.report import GeneratedReport, ReportFormat

router = APIRouter()

@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    payload: ReportGenerateRequest,
    current_user: User = Depends(require_compliance),
    db: AsyncSession = Depends(get_db),
):
    """Request generation of an audit report for a completed assessment."""
    result = await db.execute(select(Assessment).where(Assessment.id == payload.assessment_id))
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    if assessment.status.value != "completed":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Report generation requires a completed assessment",
        )

    # TODO: Dispatch Celery task for async report rendering via Jinja2 + WeasyPrint
    # For now, create a placeholder report record
    report = GeneratedReport(
        id=uuid.uuid4(),
        assessment_id=payload.assessment_id,
        report_title=f"AI Guardian Compliance Report - Assessment {str(payload.assessment_id)[:8]}",
        format=ReportFormat(payload.format),
        file_path=f"./reports/{uuid.uuid4().hex}.{payload.format}",
        cryptographic_sha256=hashlib.sha256(str(payload.assessment_id).encode()).hexdigest(),
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report

@router.get("/{report_id}/download")
async def download_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Download a generated report file."""
    result = await db.execute(select(GeneratedReport).where(GeneratedReport.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    file_path = FilePath(report.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found on disk")

    return FileResponse(
        path=str(file_path),
        filename=f"{report.report_title}.{report.format.value}",
        media_type="application/octet-stream",
    )

@router.post("/verify")
async def verify_report_integrity(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify SHA-256 integrity of a generated report file."""
    result = await db.execute(select(GeneratedReport).where(GeneratedReport.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    file_path = FilePath(report.file_path)
    if not file_path.exists():
        return {"verified": False, "reason": "Report file missing from storage"}

    file_hash = hashlib.sha256(file_path.read_bytes()).hexdigest()
    is_valid = file_hash == report.cryptographic_sha256

    return {
        "report_id": str(report.id),
        "verified": is_valid,
        "expected_sha256": report.cryptographic_sha256,
        "actual_sha256": file_hash,
        "status": "INTEGRITY_VERIFIED" if is_valid else "INTEGRITY_COMPROMISED",
    }
