import logging
import os
import sys

from dependency_injector.wiring import inject, Provide
from fastapi import Depends, FastAPI, HTTPException, Response, status

from .containers import Container
from .services import PlayerRead, PlayerService, PlayerWrite

app = FastAPI(
    title="Players Service",
    description="",
    root_path=os.getenv("HOST_PREFIX"),
    redoc_url=None,
    version="2.5.0",
)


class HealthCheckFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("/health") == -1


logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())


@app.get("/{player_id}", tags=["Players"], response_model=PlayerRead)
@inject
async def get_player(
    player_id: str,
    player_service: PlayerService = Depends(Provide[Container.player_service]),
):
    player = await player_service.read(player_id)
    if player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return player


@app.put("/{player_id}", tags=["Players"], status_code=status.HTTP_204_NO_CONTENT)
@inject
async def put_player(
    player_id: str,
    player: PlayerWrite,
    player_service: PlayerService = Depends(Provide[Container.player_service]),
):
    await player_service.update(
        player_id, {"player_id": player_id, "nickname": player.nickname}
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/", tags=["Players"], response_model=str)
@inject
async def post_player(
    player: PlayerWrite,
    player_service: PlayerService = Depends(Provide[Container.player_service]),
):
    player_id = await player_service.create({"nickname": player.nickname})
    return player_id


@app.get("/health/live", tags=["Health"])
async def get_health_live():
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/health/ready", tags=["Health"])
async def get_health_ready():
    return Response(status_code=status.HTTP_204_NO_CONTENT)


container = Container()
container.config.redis_host.from_env("REDIS_HOST", "localhost")
container.config.redis_password.from_env("REDIS_PASSWORD", "")
container.wire(modules=[sys.modules[__name__]])
