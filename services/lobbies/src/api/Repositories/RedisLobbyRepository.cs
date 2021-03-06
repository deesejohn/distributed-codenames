using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using lobbies.api.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace lobbies.api.Repositories
{
    public class RedisLobbyRepository : ILobbyRepository
    {
        private readonly IDistributedCache _cache;

        public RedisLobbyRepository(IDistributedCache cache)
        {
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<Lobby> GetAsync(string lobbyId, CancellationToken cancellationToken = default)
        {
            return JsonSerializer.Deserialize<Lobby>(
                await _cache.GetStringAsync(lobbyId, cancellationToken)
            );
        }

        public async Task UpdateAsync(string lobbyId, Lobby lobby, CancellationToken cancellationToken = default)
        {
            await _cache.SetStringAsync(
                lobbyId,
                JsonSerializer.Serialize(lobby),
                cancellationToken
            );
        }
    }
}