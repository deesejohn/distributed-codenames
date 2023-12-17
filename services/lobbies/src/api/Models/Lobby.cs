using System.Text.Json.Serialization;

namespace lobbies.api.Models;

public record Lobby(
    [property: JsonPropertyName("lobby_id")] string Id,

    [property: JsonPropertyName("host_id")] string HostId
)
{
    [JsonPropertyName("blue_team")]
    public IEnumerable<Player>? BlueTeam { get; init; }

    [JsonPropertyName("red_team")]
    public IEnumerable<Player>? RedTeam { get; init; }

    [JsonPropertyName("game_id")]
    public string? GameId { get; init; }
}
