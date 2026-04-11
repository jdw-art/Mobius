import redis.asyncio as redis
from typing import Optional

from app.config import settings


class RedisClient:
    _instance: Optional[redis.Redis] = None

    @classmethod
    async def get_client(cls) -> redis.Redis:
        if cls._instance is None:
            cls._instance = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
        return cls._instance

    @classmethod
    async def close(cls) -> None:
        if cls._instance is not None:
            await cls._instance.close()
            cls._instance = None

    @classmethod
    async def check_connection(cls) -> bool:
        try:
            client = await cls.get_client()
            await client.ping()
            return True
        except Exception:
            return False


async def get_redis() -> redis.Redis:
    return await RedisClient.get_client()
