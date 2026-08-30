import uuid
import hashlib
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.config import settings
from src.core.auth.dependencies import get_current_user, require_model_owner
from src.api.schemas import DocumentResponse

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.ai_system import AISystem
from models.document import UploadedDocument, DocumentCategory, ParsingStatus

router = APIRouter()

ALLOWED_EXTENSIONS = set(settings.ALLOWED_FILE_EXTENSIONS.split(","))

@router.post("/{system_id}/documents/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    system_id: uuid.UUID,
    file: UploadFile = File(...),
    document_category: str = Form(...),
    current_user: User = Depends(require_model_owner),
    db: AsyncSession = Depends(get_db),
):
    """Upload a technical document to an AI system."""
    # Validate file extension
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}",
        )

    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB} MB",
        )

    # SHA-256 hash for integrity & duplicate detection
    file_hash = hashlib.sha256(content).hexdigest()

    # Check duplicate within same AI system
    existing = await db.execute(
        select(UploadedDocument).where(
            UploadedDocument.ai_system_id == system_id,
            UploadedDocument.file_hash_sha256 == file_hash,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate document detected (SHA-256 match)")

    # Save to local storage (production: MinIO/S3)
    storage_dir = Path(settings.STORAGE_LOCAL_PATH) / str(current_user.organization_id) / str(system_id)
    storage_dir.mkdir(parents=True, exist_ok=True)
    file_path = storage_dir / f"{uuid.uuid4().hex}_{file.filename}"
    file_path.write_bytes(content)

    # Create DB record
    doc = UploadedDocument(
        id=uuid.uuid4(),
        ai_system_id=system_id,
        file_name=file.filename,
        file_type=ext.lstrip("."),
        document_category=DocumentCategory(document_category),
        storage_path=str(file_path),
        file_hash_sha256=file_hash,
        parsing_status=ParsingStatus.PENDING,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # TODO: Dispatch async Celery task for document parsing
    # parse_document_task.delay(str(doc.id))

    return doc

@router.get("/{system_id}/documents", response_model=List[DocumentResponse])
async def list_documents(
    system_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents attached to an AI system."""
    result = await db.execute(
        select(UploadedDocument)
        .where(UploadedDocument.ai_system_id == system_id)
        .order_by(UploadedDocument.created_at.desc())
    )
    return result.scalars().all()

@router.delete("/{system_id}/documents/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    system_id: uuid.UUID,
    doc_id: uuid.UUID,
    current_user: User = Depends(require_model_owner),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a document from an AI system."""
    result = await db.execute(
        select(UploadedDocument).where(
            UploadedDocument.id == doc_id,
            UploadedDocument.ai_system_id == system_id,
        )
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    await db.delete(doc)
    await db.commit()
