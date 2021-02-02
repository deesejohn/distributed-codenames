package game

import (
	"errors"

	pb "github.com/deesejohn/distributed-codenames/src/games/genproto"
)

const (
	blueTeam = "blue_team"
	redTeam  = "red_team"
)

// Guess a card
func Guess(game *pb.Game, playerID string, cardID string) error {
	if gameOver(game) {
		return errors.New("Cannot guess after the game is over")
	}
	var team []*pb.Player
	if game.Guessing == blueTeam {
		team = game.BlueTeam
	} else {
		team = game.RedTeam
	}
	onTeam := false
	for _, player := range team {
		if player.PlayerId == playerID {
			onTeam = true
		}
	}
	if !onTeam {
		return errors.New("Player is not on the guessing team")
	}
	for i, card := range game.Board {
		if card.CardId == cardID {
			if card.Revealed {
				return errors.New("Card already guessed")
			}
			card.Color = game.Key[i].Color
			card.Revealed = true
			game.Key[i].Revealed = true
			if card.Color == pb.Color_BLACK {
				game.Winner = oppositeTeam(game.Guessing)
			}
			if (card.Color != pb.Color_BLUE && game.Guessing == blueTeam) ||
				(card.Color != pb.Color_RED && game.Guessing == redTeam) {
				nextTurn(game)
			}
			break
		}
	}
	checkWinner(game)
	return nil
}

func checkWinner(game *pb.Game) {
	blueWon := true
	redWon := true
	for _, card := range game.Key {
		if card.Color == pb.Color_BLUE {
			blueWon = blueWon && card.Revealed
		}
		if card.Color == pb.Color_RED {
			redWon = redWon && card.Revealed
		}
	}
	if blueWon {
		game.Winner = blueTeam
	}
	if redWon {
		game.Winner = redTeam
	}
}

func oppositeTeam(team string) string {
	if team == blueTeam {
		return redTeam
	}
	return blueTeam
}

func nextTurn(game *pb.Game) {
	game.Guessing = oppositeTeam(game.Guessing)
}

func gameOver(game *pb.Game) bool {
	return game.Winner != ""
}
