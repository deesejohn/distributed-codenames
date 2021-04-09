package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"os"
	"time"

	game "github.com/deesejohn/distributed-codenames/src/games/game"
	pb "github.com/deesejohn/distributed-codenames/src/games/genproto"
	"github.com/go-redis/redis/v8"
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
	game := get(ctx, in.GameId)
	return &pb.GetGameResponse{
		Game: game,
	}, nil
}

func (s *server) CreateGame(ctx context.Context, in *pb.CreateGameRequest) (
	*pb.CreateGameResponse, error) {
	conn, err := grpc.Dial(wordsAddr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewWordsServiceClient(conn)
	cr, err := c.GetWords(ctx, &pb.WordsRequest{
		Category: pb.Category_NORMAL,
	})
	if err != nil {
		return nil, err
	}
	state, err := game.New(in.HostId, in.BlueTeam, in.RedTeam, cr.Words)
	if err != nil {
		return nil, err
	}
	set(ctx, state.GameId, state)
	go publish(state)
	return &pb.CreateGameResponse{
		GameId: state.GameId,
	}, nil
}

func (s *server) Guess(ctx context.Context, in *pb.GuessRequest) (
	*pb.GuessResponse, error) {
	state := get(ctx, in.GameId)
	err := game.Guess(state, in.PlayerId, in.CardId)
	if err != nil {
		return nil, err
	}
	set(ctx, state.GameId, state)
	go publish(state)
	return &pb.GuessResponse{}, nil
}

func (s *server) Hint(ctx context.Context, in *pb.HintRequest) (
	*pb.HintResponse, error) {
	state := get(ctx, in.GameId)
	err := game.Hint(state, in.PlayerId, in.Clue)
	if err != nil {
		return nil, err
	}
	set(ctx, state.GameId, state)
	go publish(state)
	return &pb.HintResponse{}, nil
}

func (s *server) PlayAgain(ctx context.Context, in *pb.PlayAgainRequest) (
	*pb.PlayAgainResponse, error) {
	return &pb.PlayAgainResponse{}, nil
}

func (s *server) SkipTurn(ctx context.Context, in *pb.SkipTurnRequest) (
	*pb.SkipTurnResponse, error) {
	state := get(ctx, in.GameId)
	err := game.SkipTurn(state, in.PlayerId)
	if err != nil {
		return nil, err
	}
	set(ctx, state.GameId, state)
	go publish(state)
	return &pb.SkipTurnResponse{}, nil
}

func (s *server) Check(ctx context.Context, req *healthpb.HealthCheckRequest) (
	*healthpb.HealthCheckResponse, error) {
	return &healthpb.HealthCheckResponse{
		Status: healthpb.HealthCheckResponse_SERVING,
	}, nil
}

func get(ctx context.Context, gameID string) *pb.Game {
	rdb := redis.NewClient(redisOptions)
	val, err := rdb.Get(ctx, redisPrefix+gameID).Result()
	if err != nil {
		log.Fatal(err)
	}
	var game *pb.Game
	err = json.Unmarshal([]byte(val), &game)
	if err != nil {
		log.Fatal(err)
	}
	return game
}

func set(ctx context.Context, gameID string, game *pb.Game) {
	data, err := json.Marshal(game)
	if err != nil {
		log.Fatal(err)
	}
	rdb := redis.NewClient(redisOptions)
	if rdb.Set(ctx, redisPrefix+gameID, data, 0).Err(); err != nil {
		log.Fatal(err)
	}
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
