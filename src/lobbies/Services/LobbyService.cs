using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using lobbies.Models;
using static protos.GamesService;

namespace lobbies.Services
{
    public class LobbyService
    {
        private readonly GamesServiceClient _gamesService;
        private readonly ILobbyRepository _repo;

        public LobbyService(
            GamesServiceClient gamesService,
            ILobbyRepository repo
        )
        {
            _gamesService = gamesService ?? throw new ArgumentNullException(nameof(gamesService));
            _repo = repo ?? throw new ArgumentNullException(nameof(repo));
        }

        public Task<Lobby> GetAsync(string lobbyId)
        {
            return _repo.GetAsync(lobbyId);
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
            await _repo.UpdateAsync(lobby, cancellationToken);
            return lobby.Id;
        }

        public async Task AddPlayerAsync(string lobbyId, Player player, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            if (lobby.BlueTeam.Any(IsPlayer(player.Id)))
            {
                return;
            }
            if (lobby.RedTeam.Any(IsPlayer(player.Id)))
            {
                return;
            }
            var lobbyWithPlayer = lobby.BlueTeam.Count() <= lobby.RedTeam.Count()
                ? lobby with { BlueTeam = lobby.BlueTeam.Append(player) }
                : lobby with { RedTeam = lobby.RedTeam.Append(player) };
            await _repo.UpdateAsync(lobbyWithPlayer, cancellationToken);
        }

        public async Task ChangeTeamsAsync(string lobbyId, Player player, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            var (blueTeam, redTeam) = lobby.BlueTeam.Any(IsPlayer(player.Id))
                ? (lobby.BlueTeam.Where(p => p.Id != player.Id)
                , lobby.RedTeam.Append(player))
                : (lobby.BlueTeam.Append(player)
                , lobby.RedTeam.Where(p => p.Id != player.Id));
            await _repo.UpdateAsync(
                lobby with { BlueTeam = blueTeam, RedTeam = redTeam },
                cancellationToken
            );
        }

        public async Task RemovePlayerAsync(string lobbyId, string playerId, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            await _repo.UpdateAsync(
                lobby with
                {
                    BlueTeam = lobby.BlueTeam.Where(p => p.Id != playerId),
                    RedTeam = lobby.RedTeam.Where(p => p.Id != playerId)
                },
                cancellationToken
            );
        }

        public async Task StartGameAsync(string lobbyId, string playerId, CancellationToken cancellationToken = default)
        {
            var lobby = await _repo.GetAsync(lobbyId);
            var request = new protos.CreateGameRequest
            {
                HostId = lobby.HostId,
                VocabularyId = "normal"
            };
            request.BlueTeam.AddRange(Map(lobby.BlueTeam));
            request.RedTeam.AddRange(Map(lobby.RedTeam));
            var response = await _gamesService.CreateGameAsync(request);
            await _repo.UpdateAsync(
                lobby with { GameId = response.GameId }
            );
        }

        private static Func<Player, bool> IsPlayer(string playerId)
            => (Player player) => player.Id == playerId;

        private static IEnumerable<protos.Player> Map(IEnumerable<Player> players)
        {
            return players?.Select(player => new protos.Player
            {
                PlayerId = player.Id,
                Nickname = player.Nickname
            });
        }
    }
}