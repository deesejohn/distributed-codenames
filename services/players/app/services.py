import json

from aioredis import Redis


class Service:
    def __init__(self, redis: Redis) -> None:
        self.PLAYERS_PREFIX = "players:"
        self._redis = redis

    async def read_player(self, player_id: str):
        return await self._redis.get(self.PLAYERS_PREFIX + player_id)

    async def write_player(self, player_id: str, player):
        await self._redis.set(
            self.PLAYERS_PREFIX + player_id,
            json.dumps(player),
        )
        await self._redis.expire(
            self.PLAYERS_PREFIX + player_id, 24 * 60 * 60  # 24 hours
        )
