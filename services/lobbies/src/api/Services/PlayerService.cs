using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using lobbies.api.Models;

namespace lobbies.api.Services
{
    public class PlayerService
    {
        private readonly HttpClient _client;

        public PlayerService(HttpClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public async Task<Player> GetAsync(string playerId, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _client.GetFromJsonAsync<Player>(
                    $"http://players/{playerId}",
                    cancellationToken
                );
            }
            catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
        }
    }
}