using lobbies.api.Hubs;
using lobbies.api.Models;
using Microsoft.AspNetCore.SignalR;
using static protos.GamesService;

namespace lobbies.api.Services
{
    public class LobbyService(
        GamesServiceClient gamesService,
        IHubContext<LobbyHub> lobbyHub,
        ILobbyRepository repo
    )
    {
        private readonly GamesServiceClient _gamesService = gamesService ?? throw new ArgumentNullException(nameof(gamesService));
        private readonly IHubContext<LobbyHub> _lobbyHub = lobbyHub ?? throw new ArgumentNullException(nameof(lobbyHub));
        private readonly ILobbyRepository _repo = repo ?? throw new ArgumentNullException(nameof(repo));

        public Task<Lobby?> GetAsync(string lobbyId, CancellationToken cancellationToken = default)
        {
            return _repo.GetAsync(lobbyId, cancellationToken);
        }

        public async Task<string> StartNewAsync(Player host, CancellationToken cancellationToken = default)
        {
            var lobby = new Lobby
            {
                Id = Guid.NewGuid().ToString(),
                HostId = host.Id,
                BlueTeam = new Player[] { host },
                RedTeam = Enumerable.Empty<Player>()
            };
            await _repo.UpdateAsync(lobby.Id, lobby, cancellationToken);
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, lobby, cancellationToken);
            return lobby.Id;
        }

        public async Task AddPlayerAsync(string lobbyId, Player player, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId, cancellationToken);
            if (lobby == null || string.IsNullOrEmpty(lobby.Id))
            {
                throw new Exception($"Unable to add player: lobby {lobbyId} not found");
            }
            if (player.Id == null)
            {
                throw new Exception($"Unable to add player: lobby {lobbyId} player id null");
            }
            if (lobby.BlueTeam == null || lobby.BlueTeam.Any(IsPlayer(player.Id)))
            {
                return;
            }
            if (lobby.RedTeam == null || lobby.RedTeam.Any(IsPlayer(player.Id)))
            {
                return;
            }
            var lobbyWithPlayer = lobby.BlueTeam.Count() <= lobby.RedTeam.Count()
                ? lobby with { BlueTeam = lobby.BlueTeam.Append(player) }
                : lobby with { RedTeam = lobby.RedTeam.Append(player) };
            await _repo.UpdateAsync(lobbyId, lobbyWithPlayer, cancellationToken);
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, lobbyWithPlayer, cancellationToken);
        }

        public async Task ChangeTeamsAsync(string lobbyId, Player player, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId, cancellationToken);
            if (lobby == null || string.IsNullOrEmpty(lobby.Id))
            {
                throw new Exception($"Unable to change team: lobby {lobbyId} not found");
            }
            if (lobby.BlueTeam == null || lobby.RedTeam == null)
            {
                throw new Exception($"Unable to change team: lobby {lobbyId} has invalid teams");
            }
            var (blueTeam, redTeam) = lobby.BlueTeam.Any(IsPlayer(player.Id!))
                ? (lobby.BlueTeam.Where(p => p.Id != player.Id)
                , lobby.RedTeam.Append(player))
                : (lobby.BlueTeam.Append(player)
                , lobby.RedTeam.Where(p => p.Id != player.Id));
            var nextLobby = lobby with { BlueTeam = blueTeam, RedTeam = redTeam };
            await _repo.UpdateAsync(lobbyId, nextLobby, cancellationToken);
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, nextLobby, cancellationToken);
        }

        public async Task RemovePlayerAsync(string lobbyId, string playerId, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            if (lobby == null || string.IsNullOrEmpty(lobby.Id))
            {
                throw new Exception($"Unable to remove player: lobby {lobbyId} not found");
            }
            var nextLobby = lobby with
            {
                BlueTeam = lobby.BlueTeam?.Where(p => p.Id != playerId),
                RedTeam = lobby.RedTeam?.Where(p => p.Id != playerId)
            };
            await _repo.UpdateAsync(lobbyId, nextLobby, cancellationToken);
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, nextLobby, cancellationToken);
        }

        public async Task StartGameAsync(string lobbyId, string playerId, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            if (lobby == null || string.IsNullOrEmpty(lobby.Id))
            {
                throw new Exception($"Unable to start game: lobby {lobbyId} not found");
            }
            var request = new protos.CreateGameRequest
            {
                HostId = lobby.HostId,
                VocabularyId = "normal"
            };
            request.BlueTeam.AddRange(Map(lobby.BlueTeam));
            request.RedTeam.AddRange(Map(lobby.RedTeam));
            var response = await _gamesService.CreateGameAsync(request, null, null, cancellationToken);
            var nextLobby = lobby with { GameId = response.GameId };
            await _repo.UpdateAsync(lobbyId, nextLobby, cancellationToken);
            await _lobbyHub.Clients.Group(lobby.Id)
                .SendAsync(LobbyHub.LOBBY_UPDATED, nextLobby, cancellationToken);
        }

        private static Func<Player, bool> IsPlayer(string playerId)
            => (Player player) => player.Id == playerId;

        private static IEnumerable<protos.Player> Map(IEnumerable<Player>? players)
            => players?.Select(player => new protos.Player
            {
                PlayerId = player.Id,
                Nickname = player.Nickname
            }) ?? Enumerable.Empty<protos.Player>();
    }
}
