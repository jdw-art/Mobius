import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review, ReviewProcess
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewProcessCreate, ReviewProcessUpdate


async def get_review(db: AsyncSession, review_id: str) -> Optional[Review]:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.processes))
        .where(Review.id == review_id)
    )
    return result.scalar_one_or_none()


async def get_reviews_by_project(
    db: AsyncSession,
    project_id: str,
) -> List[Review]:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.processes))
        .where(Review.project_id == project_id)
    )
    return list(result.scalars().all())


async def get_reviews_by_project_and_type(
    db: AsyncSession,
    project_id: str,
    review_type: str,
) -> List[Review]:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.processes))
        .where(Review.project_id == project_id, Review.type == review_type)
    )
    return list(result.scalars().all())


async def create_review(db: AsyncSession, data: ReviewCreate) -> Review:
    review = Review(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        requirement_id=data.requirement_id,
        type=data.type,
        title=data.title,
        creator=data.creator,
        create_time=datetime.utcnow(),
        planned_complete_time=data.planned_complete_time,
        code_branch=data.code_branch,
        pre_release_time=data.pre_release_time,
        prod_release_time=data.prod_release_time,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def update_review(
    db: AsyncSession,
    review_id: str,
    data: ReviewUpdate,
) -> Optional[Review]:
    review = await get_review(db, review_id)
    if not review:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(review, field, value)
    await db.commit()
    await db.refresh(review)
    return review


async def delete_review(db: AsyncSession, review_id: str) -> bool:
    review = await get_review(db, review_id)
    if not review:
        return False
    await db.delete(review)
    await db.commit()
    return True


async def create_review_process(db: AsyncSession, data: ReviewProcessCreate) -> ReviewProcess:
    process = ReviewProcess(
        id=str(uuid.uuid4()),
        review_id=data.review_id,
        title=data.title,
        description=data.description,
        status=data.status,
        reviewers=data.reviewers,
        review_time=data.review_time,
        comment=data.comment,
        comment_editable=data.comment_editable,
    )
    db.add(process)
    await db.commit()
    await db.refresh(process)
    return process


async def update_review_process(
    db: AsyncSession,
    process_id: str,
    data: ReviewProcessUpdate,
) -> Optional[ReviewProcess]:
    result = await db.execute(select(ReviewProcess).where(ReviewProcess.id == process_id))
    process = result.scalar_one_or_none()
    if not process:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(process, field, value)
    await db.commit()
    await db.refresh(process)
    return process
