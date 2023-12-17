using lobbies.api.Models;
using lobbies.api.ServiceClients;
using lobbies.api.Services;
using Microsoft.AspNetCore.Mvc;

namespace lobbies.api.Controllers;

[ApiController]
[Route("")]
public class LobbiesController(LobbyService lobbyService, IPlayerServiceClient playerService) : ControllerBase
{
    private readonly LobbyService _lobbyService = lobbyService ?? throw new ArgumentNullException(nameof(lobbyService));
    private readonly IPlayerServiceClient _playerService = playerService ?? throw new ArgumentNullException(nameof(playerService));

    [HttpGet("/{lobbyId}")]
    [ProducesResponseType(typeof(Lobby), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<Lobby>> GetAsync(string lobbyId, CancellationToken cancellationToken)
    {
        var lobby = await _lobbyService.GetAsync(lobbyId, cancellationToken);
        if (lobby == null)
        {
            return NotFound();
        }
        return Ok(lobby);
    }

    [HttpPost]
    [ProducesResponseType(400)]
    public async Task<ActionResult<string>> CreateAsync(CancellationToken cancellationToken)
    {
        var playerId = HttpContext.Request.Cookies["player_id"];
        if (string.IsNullOrEmpty(playerId))
        {
            return BadRequest();
        }
        var player = await _playerService.GetAsync(playerId, cancellationToken);
        if (player == null)
        {
            return BadRequest();
        }
        return await _lobbyService.StartNewAsync(player, cancellationToken);
    }

    [HttpPost("/{lobbyId}/start_game")]
    [ProducesResponseType(400)]
    public async Task<IActionResult> StartGameAsync(string lobbyId, CancellationToken cancellationToken)
    {
        var playerId = HttpContext.Request.Cookies["player_id"];
        if (string.IsNullOrEmpty(playerId))
        {
            return BadRequest("Required paramater player_id is not present");
        }
        await _lobbyService.StartGameAsync(lobbyId, playerId, cancellationToken);
        return NoContent();
    }

    [HttpPost("/{lobbyId}/player/{playerId}")]
    [ProducesResponseType(400)]
    public async Task<IActionResult> AddPlayerAsync(string lobbyId, string playerId, CancellationToken cancellationToken)
    {
        var player = await _playerService.GetAsync(playerId, cancellationToken);
        if (player == null)
        {
            return BadRequest();
        }
        await _lobbyService.AddPlayerAsync(lobbyId, player, cancellationToken);
        return NoContent();
    }

    [HttpPost("/{lobbyId}/player/{playerId}/change_team")]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ChangeTeamAsync(string lobbyId, string playerId, CancellationToken cancellationToken)
    {
        var player = await _playerService.GetAsync(playerId, cancellationToken);
        if (player == null)
        {
            return BadRequest();
        }
        await _lobbyService.ChangeTeamsAsync(lobbyId, player, cancellationToken);
        return NoContent();
    }
}
