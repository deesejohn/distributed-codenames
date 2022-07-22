from aioredis import from_url, Redis
from pydantic import BaseSettings


class RedisConfiguration(BaseSettings):
    redis_host: str
    redis_password: str


config = RedisConfiguration()


async def get_redis_pool(
    host: str = config.redis_host, password: str = config.redis_password
) -> Redis:
    pool = await from_url(f"redis://{host}", password=password)
    try:
        yield pool
    finally:
        await pool.close()
