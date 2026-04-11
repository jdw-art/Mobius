from typing import Optional, List, TypeVar, Generic

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.common import PaginatedResponse

T = TypeVar("T")


async def get_paginated(
    db: AsyncSession,
    query,
    page: int = 1,
    page_size: int = 10,
    schema_class: type[T] = None,
) -> PaginatedResponse[T]:
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Get paginated items
    offset = (page - 1) * page_size
    paginated_query = query.offset(offset).limit(page_size)
    result = await db.execute(paginated_query)
    items = result.scalars().all()

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )
