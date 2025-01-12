using Lobbies.Models;

namespace Lobbies.ServiceClients;

public interface IPlayerServiceClient
{
    Task<Player?> GetAsync(string playerId, CancellationToken cancellationToken = default);
}
