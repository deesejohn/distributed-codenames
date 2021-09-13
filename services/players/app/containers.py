from dependency_injector import containers, providers

from . import redis
from .services import PlayerService


class Container(containers.DeclarativeContainer):

    config = providers.Configuration()

    redis_pool = providers.Resource(
        redis.init_redis_pool,
        host=config.redis_host,
        password=config.redis_password,
    )

    player_service = providers.Factory(
        PlayerService,
        redis=redis_pool,
    )
