import uuid
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate


async def get_application(db: AsyncSession, application_id: str) -> Optional[Application]:
    result = await db.execute(select(Application).where(Application.id == application_id))
    return result.scalar_one_or_none()


async def get_applications_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Application]:
    result = await db.execute(
        select(Application).where(Application.project_id == project_id)
    )
    return list(result.scalars().all())


async def create_application(db: AsyncSession, data: ApplicationCreate) -> Application:
    application = Application(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        name=data.name,
        branch=data.branch,
        version=data.version,
        test_status=data.test_status,
        deploy_method=data.deploy_method,
        unit_test=data.unit_test,
        code_scan=data.code_scan,
        code_review=data.code_review,
        status=data.status,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


async def update_application(
    db: AsyncSession,
    application_id: str,
    data: ApplicationUpdate,
) -> Optional[Application]:
    application = await get_application(db, application_id)
    if not application:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    await db.commit()
    await db.refresh(application)
    return application


async def delete_application(db: AsyncSession, application_id: str) -> bool:
    application = await get_application(db, application_id)
    if not application:
        return False
    await db.delete(application)
    await db.commit()
    return True
