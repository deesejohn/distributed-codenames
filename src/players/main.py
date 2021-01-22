import json
import logging
import os
import uuid
from aredis import StrictRedis
from fastapi import FastAPI, HTTPException, Response, status
from pydantic import BaseModel


app = FastAPI(
    title="Players Service",
    description="",
    root_path=os.getenv('HOST_PREFIX'),
    redoc_url=None,
    version="2.5.0",
)

class HealthCheckFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/health") == -1
logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())

class PlayerRead(BaseModel):
    player_id: str
    nickname: str

class PlayerWrite(BaseModel):
    nickname: str

class player_store():
    def __init__(self):
        self.PLAYERS_PREFIX = 'players:'
        self.redis = StrictRedis(
            host=os.getenv('REDIS_HOST'),
            port=6379,
            db=0,
            password=os.getenv('REDIS_PASSWORD')
        )

    async def get(self, player_id: str):
        return await self.redis.get(self.PLAYERS_PREFIX + player_id)

    async def set(self, player_id: str, player: PlayerWrite):
        return await self.redis.set(
            self.PLAYERS_PREFIX + player_id,
            json.dumps({'player_id': player_id, 'nickname': player.nickname})
        )

player_db = player_store()

@app.get("/{player_id}", tags=["Players"], response_model=PlayerRead)
async def get_player(player_id: str):
    player = await player_db.get(player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return json.loads(player)

@app.put("/{player_id}", tags=["Players"], status_code=status.HTTP_204_NO_CONTENT)
async def put_player(player_id: str, player: PlayerWrite):
    await player_db.set(player_id, player)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.post("/", tags=["Players"], response_model=str)
async def post_player(player: PlayerWrite):
    player_id = str(uuid.uuid4())
    await player_db.set(player_id, player)
    return player_id

@app.get("/health/live", tags=["Health"])
async def get_health_live():
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.get("/health/ready", tags=["Health"])
async def get_health_ready():
    return Response(status_code=status.HTTP_204_NO_CONTENT)