using System;
using System.Threading.Tasks;
using lobbies.api.ServiceClients;
using lobbies.api.Services;
using Microsoft.AspNetCore.SignalR;

namespace lobbies.api.Hubs
{
    public class LobbyHub : Hub
    {
        public const string LOBBY_UPDATED = "LobbyUpdated";
        private readonly LobbyService _lobbyService;
        private readonly PlayerServiceClient _playerService;

        public LobbyHub(LobbyService lobbyService, PlayerServiceClient playerService)
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
            var playerId = GetUserId();
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                lobbyId
            );
            var player = await _playerService.GetAsync(playerId);
            await _lobbyService.AddPlayerAsync(lobbyId, player);
            await Clients.Caller.SendAsync(
                LOBBY_UPDATED,
                await _lobbyService.GetAsync(lobbyId)
            );
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var lobbyId = GetLobbyId();
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                lobbyId
            );
            await _lobbyService.RemovePlayerAsync(lobbyId, GetUserId());
            await base.OnDisconnectedAsync(exception);
        }

        private string GetLobbyId()
            => Context.GetHttpContext().Request.Query["lobby_id"].ToString();

        private string GetUserId()
            => Context.GetHttpContext().Request.Cookies["player_id"].ToString();
    }
}