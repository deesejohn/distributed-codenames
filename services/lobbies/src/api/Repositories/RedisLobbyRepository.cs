using System.Text.Json;
using lobbies.api.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace lobbies.api.Repositories
{
    public class RedisLobbyRepository(IDistributedCache cache) : ILobbyRepository
    {
        private readonly IDistributedCache _cache = cache ?? throw new ArgumentNullException(nameof(cache));

        public async Task<Lobby?> GetAsync(string lobbyId, CancellationToken cancellationToken = default)
        {
            var lobby = await _cache.GetStringAsync(lobbyId, cancellationToken);
            if (lobby == null)
            {
                return null;
            }
            return JsonSerializer.Deserialize<Lobby>(lobby);
        }

        public async Task UpdateAsync(string lobbyId, Lobby lobby, CancellationToken cancellationToken = default)
        {
            await _cache.SetStringAsync(
                lobbyId,
                JsonSerializer.Serialize(lobby),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
                },
                cancellationToken
            );
        }
    }
}
