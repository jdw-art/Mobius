import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate


async def get_document(db: AsyncSession, document_id: str) -> Optional[Document]:
    result = await db.execute(select(Document).where(Document.id == document_id))
    return result.scalar_one_or_none()


async def get_documents_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Document]:
    result = await db.execute(
        select(Document).where(Document.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_document(db: AsyncSession, data: DocumentCreate) -> Document:
    document = Document(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        type=data.type,
        name=data.name,
        link=data.link,
        creator=data.creator,
        create_time=datetime.utcnow(),
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return document


async def update_document(
    db: AsyncSession,
    document_id: str,
    data: DocumentUpdate,
) -> Optional[Document]:
    document = await get_document(db, document_id)
    if not document:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)
    await db.commit()
    await db.refresh(document)
    return document


async def delete_document(db: AsyncSession, document_id: str) -> bool:
    document = await get_document(db, document_id)
    if not document:
        return False
    await db.delete(document)
    await db.commit()
    return True
