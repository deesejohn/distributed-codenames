using System.Threading;
using System.Threading.Tasks;
using lobbies.api.Models;

namespace lobbies.api.ServiceClients
{
    public interface IPlayerServiceClient
    {
        Task<Player> GetAsync(string playerId, CancellationToken cancellationToken = default);
    }
}