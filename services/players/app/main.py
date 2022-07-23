import logging

from fastapi import Depends, FastAPI, HTTPException, Response, status
from pydantic import BaseSettings

from .services import PlayerRead, PlayerService, PlayerWrite


class AppConfiguration(BaseSettings):
    host_prefix: str


config = AppConfiguration()

app = FastAPI(
    title="Players Service",
    description="",
    root_path=config.host_prefix,
    redoc_url=None,
    version="2.5.0",
)


class HealthCheckFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/health") == -1


logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())


players_tags = ["Players"]


@app.get("/{player_id}", tags=players_tags, response_model=PlayerRead)
async def get_player(
    player_id: str,
    player_service: PlayerService = Depends(PlayerService),
):
    player = await player_service.read(player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return player


@app.put("/{player_id}", tags=players_tags, status_code=status.HTTP_204_NO_CONTENT)
async def put_player(
    player_id: str,
    player: PlayerWrite,
    player_service: PlayerService = Depends(PlayerService),
):
    await player_service.update(player_id, player)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/", tags=players_tags, response_model=str)
async def post_player(
    player: PlayerWrite,
    player_service: PlayerService = Depends(PlayerService),
):
    player_id = await player_service.create(player)
    return player_id


health_tags = ["Health"]


@app.get("/health/live", tags=health_tags)
async def get_health_live():
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/health/ready", tags=health_tags)
async def get_health_ready():
    return Response(status_code=status.HTTP_204_NO_CONTENT)
