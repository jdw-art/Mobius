import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workflow_step import WorkflowStep
from app.schemas.workflow_step import WorkflowStepCreate, WorkflowStepUpdate


async def get_workflow_step(db: AsyncSession, workflow_step_id: str) -> Optional[WorkflowStep]:
    result = await db.execute(select(WorkflowStep).where(WorkflowStep.id == workflow_step_id))
    return result.scalar_one_or_none()


async def get_workflow_steps_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[WorkflowStep]:
    result = await db.execute(
        select(WorkflowStep).where(WorkflowStep.project_id == project_id).order_by(WorkflowStep.step)
    )
    return list(result.scalars().all())


async def create_workflow_step(db: AsyncSession, data: WorkflowStepCreate) -> WorkflowStep:
    workflow_step = WorkflowStep(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        step=data.step,
        name=data.name,
        status=data.status,
        time=data.time,
    )
    db.add(workflow_step)
    await db.commit()
    await db.refresh(workflow_step)
    return workflow_step


async def update_workflow_step(
    db: AsyncSession,
    workflow_step_id: str,
    data: WorkflowStepUpdate,
) -> Optional[WorkflowStep]:
    workflow_step = await get_workflow_step(db, workflow_step_id)
    if not workflow_step:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workflow_step, field, value)
    await db.commit()
    await db.refresh(workflow_step)
    return workflow_step


async def delete_workflow_step(db: AsyncSession, workflow_step_id: str) -> bool:
    workflow_step = await get_workflow_step(db, workflow_step_id)
    if not workflow_step:
        return False
    await db.delete(workflow_step)
    await db.commit()
    return True
