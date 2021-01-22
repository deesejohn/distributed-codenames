using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using lobbies.Hubs;
using lobbies.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;

namespace lobbies.Repositories
{
    public class RedisLobbyRepository : ILobbyRepository
    {
        private readonly IDistributedCache _cache;
        private readonly IHubContext<LobbyHub> _lobbyHub;

        public RedisLobbyRepository(IDistributedCache cache, IHubContext<LobbyHub> lobbyHub)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
            _lobbyHub = lobbyHub ?? throw new ArgumentNullException(nameof(lobbyHub));
        }

        public async Task<Lobby> GetAsync(string lobbyId, CancellationToken cancellationToken = default)
        {
            return JsonSerializer.Deserialize<Lobby>(
                await _cache.GetStringAsync(lobbyId, cancellationToken)
            );
        }

        public async Task UpdateAsync(Lobby lobby, CancellationToken cancellationToken = default)
        {
            await _cache.SetStringAsync(
                lobby.Id,
                JsonSerializer.Serialize(lobby),
                cancellationToken
            );
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, lobby, cancellationToken);
        }
    }
}