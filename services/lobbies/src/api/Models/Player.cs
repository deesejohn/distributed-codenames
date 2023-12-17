using System.Text.Json.Serialization;

namespace lobbies.api.Models;

public record Player(
    [property: JsonPropertyName("player_id")] string Id,

    [property: JsonPropertyName("nickname")] string Nickname
)
{
    public virtual bool Equals(Player? other)
    {
        return other is not null && Id == other.Id;
    }

    public override int GetHashCode() => Id.GetHashCode();
}
