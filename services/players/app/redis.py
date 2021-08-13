from aioredis import from_url, Redis
from typing import AsyncIterator


async def init_redis_pool(host: str, password: str) -> AsyncIterator[Redis]:
    pool = await from_url(f"redis://{host}", password=password)
    yield pool
    pool.close()
    await pool.wait_closed()
