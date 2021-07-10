using System;
using System.Threading;
using System.Threading.Tasks;
using lobbies.api.Models;
using lobbies.api.ServiceClients;
using lobbies.api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace lobbies.api.Controllers
{
    [ApiController]
    [Route("")]
    public class LobbiesController : ControllerBase
    {
        private readonly LobbyService _lobbyService;
        private readonly PlayerServiceClient _playerService;

        public LobbiesController(LobbyService lobbyService, PlayerServiceClient playerService)
        {
            _lobbyService = lobbyService ?? throw new ArgumentNullException(nameof(lobbyService));
            _playerService = playerService ?? throw new ArgumentNullException(nameof(playerService));
        }

        [HttpGet("/{lobbyId}")]
        public Task<Lobby> GetAsync(string lobbyId, CancellationToken cancellationToken)
        {
            return _lobbyService.GetAsync(lobbyId, cancellationToken);
        }

        [HttpPost]
        public async Task<string> CreateAsync(CancellationToken cancellationToken)
        {
            var playerId = HttpContext.Request.Cookies["player_id"];
            var player = await _playerService.GetAsync(playerId, cancellationToken);
            return await _lobbyService.StartNewAsync(player, cancellationToken);
        }

        [HttpPost("/{lobbyId}/start_game")]
        public async Task<IActionResult> StartGameAsync(string lobbyId, CancellationToken cancellationToken)
        {
            var playerId = HttpContext.Request.Cookies["player_id"];
            await _lobbyService.StartGameAsync(lobbyId, playerId, cancellationToken);
            return NoContent();
        }

        [HttpPost("/{lobbyId}/player/{playerId}")]
        public async Task<IActionResult> AddPlayerAsync(string lobbyId, string playerId, CancellationToken cancellationToken)
        {
            var player = await _playerService.GetAsync(playerId, cancellationToken);
            await _lobbyService.AddPlayerAsync(lobbyId, player, cancellationToken);
            return NoContent();
        }

        [HttpPost("/{lobbyId}/player/{playerId}/change_team")]
        public async Task<IActionResult> ChangeTeamAsync(string lobbyId, string playerId, CancellationToken cancellationToken)
        {
            var player = await _playerService.GetAsync(playerId, cancellationToken);
            await _lobbyService.ChangeTeamsAsync(lobbyId, player, cancellationToken);
            return NoContent();
        }
    }
}