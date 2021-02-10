package game

import (
	"errors"
	"math/rand"

	pb "github.com/deesejohn/distributed-codenames/src/games/genproto"
	"github.com/google/uuid"
)

const (
	BlueTeam = "blue_team"
	RedTeam  = "red_team"
)

// Guess a card
func Guess(game *pb.Game, playerID string, cardID string) error {
	if gameOver(game) {
		return errors.New("Cannot guess after the game is over")
	}
	var team []*pb.Player
	if game.Guessing == BlueTeam {
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
			if game.Clue.Number < 1 {
				return errors.New("Out of guesses")
			}
			card.Color = game.Key[i].Color
			card.Revealed = true
			game.Clue.Number--
			game.Key[i].Revealed = true
			if card.Color == pb.Color_BLACK {
				game.Winner = oppositeTeam(game.Guessing)
			}
			if (card.Color != pb.Color_BLUE && game.Guessing == BlueTeam) ||
				(card.Color != pb.Color_RED && game.Guessing == RedTeam) {
				nextTurn(game)
			}
			break
		}
	}
	checkWinner(game)
	return nil
}

// Hint sets a clue
func Hint(game *pb.Game, playerID string, clue *pb.Clue) error {
	var spymaster string
	if game.Guessing == BlueTeam {
		spymaster = game.BlueTeamSpymaster
	} else if game.Guessing == RedTeam {
		spymaster = game.RedTeamSpymaster
	}
	if playerID != spymaster {
		return errors.New("You are the not guessing team's spymaster")
	}
	game.Clue = clue
	// The guessing team gets n + 1 guesses
	game.Clue.Number++
	return nil
}

// New creates a game
func New(hostID string, blueTeam []*pb.Player, redTeam []*pb.Player,
	words []string) (*pb.Game, error) {
	gameID := uuid.New().String()
	rand.Shuffle(len(words), func(i, j int) {
		words[i], words[j] = words[j], words[i]
	})
	colors := []pb.Color{pb.Color_BLACK}
	for i := 0; i < 7; i++ {
		colors = append(colors, pb.Color_BEIGE)
	}
	for i := 0; i < 8; i++ {
		colors = append(colors, pb.Color_BLUE, pb.Color_RED)
	}
	var guessing string
	if rand.Float64() < .5 {
		colors = append(colors, pb.Color_BLUE)
		guessing = BlueTeam
	} else {
		colors = append(colors, pb.Color_RED)
		guessing = RedTeam
	}
	rand.Shuffle(len(colors), func(i, j int) {
		colors[i], colors[j] = colors[j], colors[i]
	})
	var board []*pb.Card
	var key []*pb.Card
	for i := 0; i < 25; i++ {
		cardID := uuid.New().String()
		board = append(board, &pb.Card{
			CardId:   cardID,
			Color:    pb.Color_UNKNOWN_COLOR,
			Label:    words[i],
			Revealed: false,
		})
		key = append(key, &pb.Card{
			CardId:   cardID,
			Color:    colors[i],
			Label:    words[i],
			Revealed: false,
		})
	}
	clue := &pb.Clue{
		Word:   "",
		Number: 0,
	}
	game := &pb.Game{
		GameId:            gameID,
		HostId:            hostID,
		BlueTeam:          blueTeam,
		BlueTeamSpymaster: blueTeam[0].PlayerId,
		RedTeam:           redTeam,
		RedTeamSpymaster:  redTeam[0].PlayerId,
		Board:             board,
		Key:               key,
		Guessing:          guessing,
		Clue:              clue,
		Winner:            "",
	}
	return game, nil
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
		game.Winner = BlueTeam
	}
	if redWon {
		game.Winner = RedTeam
	}
}

func oppositeTeam(team string) string {
	if team == BlueTeam {
		return RedTeam
	}
	return BlueTeam
}

func nextTurn(game *pb.Game) {
	game.Clue.Number = 0
	game.Clue.Word = ""
	game.Guessing = oppositeTeam(game.Guessing)
}

func gameOver(game *pb.Game) bool {
	return game.Winner != ""
}
