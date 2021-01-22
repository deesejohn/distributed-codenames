using System.Threading;
using System.Threading.Tasks;

namespace lobbies.Models
{
    public interface ILobbyRepository
    {
        Task<Lobby> GetAsync(string lobbyId, CancellationToken cancellationToken = default);
        Task UpdateAsync(Lobby lobby, CancellationToken cancellationToken = default);
    }
}