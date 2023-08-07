using lobbies.api.ServiceClients;
using lobbies.api.Services;
using Microsoft.AspNetCore.SignalR;

namespace lobbies.api.Hubs
{
    public class LobbyHub : Hub
    {
        public const string LOBBY_UPDATED = "LobbyUpdated";
        private readonly LobbyService _lobbyService;
        private readonly IPlayerServiceClient _playerService;

        public LobbyHub(LobbyService lobbyService, IPlayerServiceClient playerService)
        {
            _lobbyService = lobbyService
                ?? throw new ArgumentNullException(nameof(lobbyService));
            _playerService = playerService
                ?? throw new ArgumentNullException(nameof(playerService));
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            var lobbyId = GetLobbyId();
            if (lobbyId == null)
            {
                await base.Clients.Caller.SendAsync("Error: invalid lobby id");
                return;
            }
            var playerId = GetUserId();
            if (playerId == null)
            {
                await base.Clients.Caller.SendAsync("Error: invalid palyer id");
                return;
            }
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                lobbyId
            );
            var player = await _playerService.GetAsync(playerId);
            if (player == null)
            {
                await base.Clients.Caller.SendAsync("Error: invalid palyer id");
                return;
            }
            await _lobbyService.AddPlayerAsync(lobbyId, player);
            await Clients.Caller.SendAsync(
                LOBBY_UPDATED,
                await _lobbyService.GetAsync(lobbyId)
            );
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var lobbyId = GetLobbyId();
            if (lobbyId == null)
            {
                await base.Clients.Caller.SendAsync("Error: invalid lobby id");
                return;
            }
            var playerId = GetUserId();
            if (playerId == null)
            {
                await base.Clients.Caller.SendAsync("Error: invalid palyer id");
                return;
            }
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                lobbyId
            );
            await _lobbyService.RemovePlayerAsync(lobbyId, playerId);
            await base.OnDisconnectedAsync(exception);
        }

        private string? GetLobbyId()
            => Context.GetHttpContext()?.Request.Query["lobby_id"].ToString();

        private string? GetUserId()
            => Context.GetHttpContext()?.Request.Cookies["player_id"]?.ToString();
    }
}
