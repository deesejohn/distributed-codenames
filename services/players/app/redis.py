import redis.asyncio as redis
from pydantic import BaseSettings


class RedisConfiguration(BaseSettings):
    redis_host: str
    redis_password: str


config = RedisConfiguration()

pool = redis.ConnectionPool.from_url(f"redis://{config.redis_host}", password=config.redis_password)

async def get_redis_pool() -> redis.Redis:
    client = await redis.Redis.from_pool(pool)
    try:
        yield client
    finally:
        await client.close()
