using System.Text.Json.Serialization;

namespace lobbies.api.Models
{
    public record Player
    {
        [JsonPropertyName("player_id")]
        public string? Id { get; init; }

        [JsonPropertyName("nickname")]
        public string? Nickname { get; init; }
    }
}