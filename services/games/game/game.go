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
		return errors.New("cannot guess after the game is over")
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
		return errors.New("player is not on the guessing team")
	}
	if game.Clue.Number < 1 {
		nextTurn(game)
		return errors.New("out of guesses")
	}
	for i, card := range game.Board {
		if card.CardId == cardID {
			if card.Revealed {
				return errors.New("card already guessed")
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
				game.Clue.Number = 0
			}
			break
		}
	}
	if game.Clue.Number < 1 {
		nextTurn(game)
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
		return errors.New("player is the not guessing team's spymaster")
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
	var guessing string
	if rand.Float64() < .5 {
		guessing = BlueTeam
	} else {
		guessing = RedTeam
	}
	colors := randomColors(guessing)
	board, key := generateBoard(words, colors)
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

// PlayAgain starts a new game after one has completed
func PlayAgain(game *pb.Game, hostID string, words []string) error {
	if !gameOver(game) {
		return errors.New("game still in progress")
	}
	if game.HostId != hostID {
		return errors.New("player is not the host")
	}
	game.Guessing = oppositeTeam(game.Guessing)
	colors := randomColors(game.Guessing)
	board, key := generateBoard(words, colors)
	clue := &pb.Clue{
		Word:   "",
		Number: 0,
	}
	game.Board = board
	game.Key = key
	game.Clue = clue
	game.Winner = ""
	return nil
}

// SkipTurn skips the current guess
func SkipTurn(game *pb.Game, playerID string) error {
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
			break
		}
	}
	if !onTeam {
		return errors.New("player not on the guessing team")
	}
	nextTurn(game)
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

func generateBoard(words []string, colors []pb.Color) ([]*pb.Card, []*pb.Card) {
	rand.Shuffle(len(words), func(i, j int) {
		words[i], words[j] = words[j], words[i]
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
	return board, key
}

func randomColors(guessing string) []pb.Color {
	colors := []pb.Color{pb.Color_BLACK}
	for i := 0; i < 7; i++ {
		colors = append(colors, pb.Color_BEIGE)
	}
	for i := 0; i < 8; i++ {
		colors = append(colors, pb.Color_BLUE, pb.Color_RED)
	}
	if guessing == BlueTeam {
		colors = append(colors, pb.Color_BLUE)
	} else {
		colors = append(colors, pb.Color_RED)
	}
	rand.Shuffle(len(colors), func(i, j int) {
		colors[i], colors[j] = colors[j], colors[i]
	})
	return colors
}
