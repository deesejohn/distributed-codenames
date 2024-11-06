package main

import (
	"context"
	_ "embed"
	"log"
	"net"
	"strings"

	pb "github.com/deesejohn/distributed-codenames/src/words/genproto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/status"
)

//go:embed assets/normal.csv
var normal string

type server struct {
	pb.UnimplementedWordsServiceServer
	healthpb.UnimplementedHealthServer
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatal(err)
	}
	srv := grpc.NewServer()
	svc := &server{}
	pb.RegisterWordsServiceServer(srv, svc)
	healthpb.RegisterHealthServer(srv, svc)
	if err = srv.Serve(lis); err != nil {
		log.Fatal(err)
	}
}

func (s *server) GetWords(ctx context.Context, in *pb.WordsRequest) (
	*pb.WordsResponse, error) {
	var csv string
	switch in.Category {
	case pb.Category_NORMAL:
		csv = normal
	}
	if csv == "" {
		return nil, status.Error(codes.InvalidArgument, "Unknown category")
	}
	words := strings.Split(csv, "\n")
	return &pb.WordsResponse{
		Category: pb.Category_NORMAL,
		Words:    words,
	}, nil
}

func (s *server) Check(ctx context.Context, req *healthpb.HealthCheckRequest) (*healthpb.HealthCheckResponse, error) {
	return &healthpb.HealthCheckResponse{Status: healthpb.HealthCheckResponse_SERVING}, nil
}
