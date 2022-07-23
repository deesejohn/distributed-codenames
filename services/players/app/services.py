import json
import uuid

from aioredis import Redis
from fastapi import Depends
from pydantic import BaseModel

from .redis import get_redis_pool

PLAYERS_PREFIX = "players:"


class PlayerRead(BaseModel):
    player_id: str
    nickname: str


class PlayerWrite(BaseModel):
    nickname: str


class PlayerService:
    def __init__(self, redis: Redis = Depends(get_redis_pool)) -> None:
        self.redis = redis

    async def create(self, player: PlayerWrite) -> str:
        player_id = str(uuid.uuid4())
        await self.redis.set(
            PLAYERS_PREFIX + player_id,
            json.dumps(dict(player) | {"player_id": player_id}),
        )
        await self.redis.expire(PLAYERS_PREFIX + player_id, 24 * 60 * 60)  # 24 hours
        return player_id

    async def read(self, player_id: str) -> PlayerRead:
        player = await self.redis.get(PLAYERS_PREFIX + player_id)
        return json.loads(player)

    async def update(self, player_id: str, player: PlayerWrite) -> None:
        await self.redis.set(
            PLAYERS_PREFIX + player_id,
            json.dumps(dict(player) | {"player_id": player_id}),
        )
