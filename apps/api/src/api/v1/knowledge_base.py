from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.core.auth.dependencies import get_current_user
from src.api.schemas import KnowledgeSourceResponse

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent.parent / "packages" / "database"))
from models.user import User
from models.compliance import KnowledgeSource

router = APIRouter()

@router.get("/sources", response_model=List[KnowledgeSourceResponse])
async def list_knowledge_sources(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active core and finance regulatory knowledge base frameworks."""
    result = await db.execute(
        select(KnowledgeSource)
        .where(KnowledgeSource.is_active == True)
        .order_by(KnowledgeSource.category, KnowledgeSource.source_code)
    )
    return result.scalars().all()
