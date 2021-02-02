package game

import (
	"errors"

	pb "github.com/deesejohn/distributed-codenames/src/games/genproto"
)

// Guess a card
func Guess(game *pb.Game, cardID string) error {
	if gameOver(game) {
		return errors.New("Cannot guess after the game is over")
	}
	for i, card := range game.Board {
		if card.CardId == cardID {
			card.Color = game.Key[i].Color
			card.Revealed = true
			game.Key[i].Revealed = true
			break
		}
	}
	nextTurn(game)
	return nil
}

func nextTurn(game *pb.Game) {
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
		game.Winner = "blue_team"
	}
	if redWon {
		game.Winner = "red_team"
	}
	if game.Guessing == "blue_team" {
		game.Guessing = "red_team"
	} else {
		game.Guessing = "blue_team"
	}
}

func gameOver(game *pb.Game) bool {
	return game.Winner != ""
}
