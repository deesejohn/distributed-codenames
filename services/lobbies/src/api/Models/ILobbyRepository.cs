namespace lobbies.api.Models
{
    public interface ILobbyRepository
    {
        Task<Lobby?> GetAsync(string lobbyId, CancellationToken cancellationToken = default);
        Task UpdateAsync(string lobbyId, Lobby lobby, CancellationToken cancellationToken = default);
    }
}