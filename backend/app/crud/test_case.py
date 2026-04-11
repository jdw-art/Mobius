import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.test_case import TestCase
from app.schemas.test_case import TestCaseCreate, TestCaseUpdate


async def get_test_case(db: AsyncSession, test_case_id: str) -> Optional[TestCase]:
    result = await db.execute(select(TestCase).where(TestCase.id == test_case_id))
    return result.scalar_one_or_none()


async def get_test_cases_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[TestCase]:
    result = await db.execute(
        select(TestCase).where(TestCase.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_test_case(db: AsyncSession, data: TestCaseCreate) -> TestCase:
    test_case = TestCase(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        application_id=data.application_id or "",
        name=data.name,
        status=data.status,
        creator=data.creator,
        create_time=datetime.utcnow(),
    )
    db.add(test_case)
    await db.commit()
    await db.refresh(test_case)
    return test_case


async def update_test_case(
    db: AsyncSession,
    test_case_id: str,
    data: TestCaseUpdate,
) -> Optional[TestCase]:
    test_case = await get_test_case(db, test_case_id)
    if not test_case:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(test_case, field, value)
    await db.commit()
    await db.refresh(test_case)
    return test_case


async def delete_test_case(db: AsyncSession, test_case_id: str) -> bool:
    test_case = await get_test_case(db, test_case_id)
    if not test_case:
        return False
    await db.delete(test_case)
    await db.commit()
    return True
