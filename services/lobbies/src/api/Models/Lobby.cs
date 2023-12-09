using System.Text.Json.Serialization;

namespace lobbies.api.Models
{
    public record Lobby
    {
        [JsonPropertyName("lobby_id")]
        public string? Id { get; init; }

        [JsonPropertyName("host_id")]
        public string? HostId { get; init; }

        [JsonPropertyName("blue_team")]
        public IEnumerable<Player>? BlueTeam { get; init; }

        [JsonPropertyName("red_team")]
        public IEnumerable<Player>? RedTeam { get; init; }

        [JsonPropertyName("game_id")]
        public string? GameId { get; init; }
    }
}
