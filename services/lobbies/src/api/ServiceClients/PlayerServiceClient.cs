using System.Net;
using lobbies.api.Models;

namespace lobbies.api.ServiceClients
{
    public class PlayerServiceClient : IPlayerServiceClient
    {
        private readonly HttpClient _client;

        public PlayerServiceClient(HttpClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public async Task<Player?> GetAsync(string playerId, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _client.GetFromJsonAsync<Player>(
                    $"/{playerId}",
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