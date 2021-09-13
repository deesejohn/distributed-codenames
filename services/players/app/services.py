import json
import uuid

from aioredis import Redis
from pydantic import BaseModel


class PlayerRead(BaseModel):
    player_id: str
    nickname: str


class PlayerWrite(BaseModel):
    nickname: str


class PlayerService:
    def __init__(self, redis: Redis) -> None:
        self.PLAYERS_PREFIX = "players:"
        self._redis = redis

    async def create(self, player: PlayerWrite):
        player_id = str(uuid.uuid4())
        await self._redis.set(
            self.PLAYERS_PREFIX + player_id,
            json.dumps(player),
        )
        await self._redis.expire(
            self.PLAYERS_PREFIX + player_id, 24 * 60 * 60  # 24 hours
        )
        return player_id

    async def read(self, player_id: str) -> PlayerRead:
        player = await self._redis.get(self.PLAYERS_PREFIX + player_id)
        return json.loads(player)

    async def update(self, player_id: str, player: PlayerWrite):
        await self._redis.set(
            self.PLAYERS_PREFIX + player_id,
            json.dumps(player),
        )
