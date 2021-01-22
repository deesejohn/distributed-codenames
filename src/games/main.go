package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"os"
	"time"

	pb "github.com/deesejohn/distributed-codenames/src/games/genproto"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	nats "github.com/nats-io/nats.go"
	"google.golang.org/grpc"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

type server struct {
	pb.UnimplementedGamesServiceServer
	healthpb.UnimplementedHealthServer
}

const (
	natsSubject = "games."
	redisPrefix = "games:"
)

var (
	natsURL      string
	redisOptions *redis.Options
	wordsAddr    string
)

func main() {
	rand.Seed(time.Now().UTC().UnixNano())
	natsURL = nats.DefaultURL
	if value, ok := os.LookupEnv("NATS_HOST"); ok {
		natsURL = "nats://" + value + ":4222"
	}
	host := "localhost"
	if value, ok := os.LookupEnv("REDIS_HOST"); ok {
		host = value
	}
	password := ""
	if value, ok := os.LookupEnv("REDIS_PASSWORD"); ok {
		password = value
	}
	redisOptions = &redis.Options{
		Addr:     host + ":6379",
		Password: password,
		DB:       0,
	}
	wordsAddr = "localhost:3000"
	if value, ok := os.LookupEnv("WORDS_ADDRESS"); ok {
		wordsAddr = value
	}
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatal(err)
	}
	srv := grpc.NewServer()
	svc := &server{}
	pb.RegisterGamesServiceServer(srv, svc)
	healthpb.RegisterHealthServer(srv, svc)
	if err = srv.Serve(lis); err != nil {
		log.Fatal(err)
	}
}

func (s *server) GetGame(ctx context.Context, in *pb.GetGameRequest) (
	*pb.GetGameResponse, error) {
	game, err := get(ctx, in.GameId)
	if err != nil {
		log.Fatal(err)
	}
	return &pb.GetGameResponse{
		Game: game,
	}, nil
}

func (s *server) CreateGame(ctx context.Context, in *pb.CreateGameRequest) (
	*pb.CreateGameResponse, error) {
	gameID := uuid.New().String()
	conn, err := grpc.Dial(wordsAddr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewWordsServiceClient(conn)
	cr, err := c.GetWords(ctx, &pb.WordsRequest{
		Category: pb.Category_NORMAL,
	})
	rand.Shuffle(len(cr.Words), func(i, j int) {
		cr.Words[i], cr.Words[j] = cr.Words[j], cr.Words[i]
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
		guessing = "blue_team"
	} else {
		colors = append(colors, pb.Color_RED)
		guessing = "red_team"
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
			Label:    cr.Words[i],
			Revealed: false,
		})
		key = append(key, &pb.Card{
			CardId:   cardID,
			Color:    colors[i],
			Label:    cr.Words[i],
			Revealed: true,
		})
	}
	clue := &pb.Clue{
		Word:   "",
		Number: 0,
	}
	game := &pb.Game{
		GameId:            gameID,
		HostId:            in.HostId,
		BlueTeam:          in.BlueTeam,
		BlueTeamSpymaster: in.BlueTeam[0].PlayerId,
		RedTeam:           in.RedTeam,
		RedTeamSpymaster:  in.RedTeam[0].PlayerId,
		Board:             board,
		Key:               key,
		Guessing:          guessing,
		Clue:              clue,
	}
	if err := set(ctx, gameID, game); err != nil {
		log.Fatal(err)
	}
	go publish(game)
	return &pb.CreateGameResponse{
		GameId: gameID,
	}, nil
}

func (s *server) Guess(ctx context.Context, in *pb.GuessRequest) (
	*pb.GuessResponse, error) {
	game, err := get(ctx, in.GameId)
	if err != nil {
		log.Fatal(err)
	}
	for i, card := range game.Board {
		if card.CardId == in.CardId {
			card.Color = game.Key[i].Color
			card.Revealed = true
			set(ctx, game.GameId, game)
			go publish(game)
			break
		}
	}
	return &pb.GuessResponse{}, nil
}

func (s *server) Check(ctx context.Context, req *healthpb.HealthCheckRequest) (*healthpb.HealthCheckResponse, error) {
	return &healthpb.HealthCheckResponse{Status: healthpb.HealthCheckResponse_SERVING}, nil
}

func get(ctx context.Context, gameID string) (*pb.Game, error) {
	rdb := redis.NewClient(redisOptions)
	val, err := rdb.Get(ctx, redisPrefix+gameID).Result()
	if err != nil {
		return nil, err
	}
	var game *pb.Game
	err = json.Unmarshal([]byte(val), &game)
	if err != nil {
		return nil, err
	}
	return game, nil
}

func set(ctx context.Context, gameID string, game *pb.Game) error {
	data, err := json.Marshal(game)
	if err != nil {
		return err
	}
	rdb := redis.NewClient(redisOptions)
	if rdb.Set(ctx, redisPrefix+gameID, data, 0).Err(); err != nil {
		return err
	}
	return nil
}

func publish(game *pb.Game) {
	nc, err := nats.Connect(natsURL)
	if err != nil {
		log.Fatal(err)
	}
	c, _ := nats.NewEncodedConn(nc, nats.JSON_ENCODER)
	defer nc.Close()
	err = c.Publish(natsSubject+game.GameId, game)
	if err != nil {
		log.Fatal(err)
	}
}
