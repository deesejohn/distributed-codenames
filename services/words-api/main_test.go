package main

import (
	"context"
	"log"
	"net"
	"testing"

	pb "github.com/deesejohn/distributed-codenames/src/words/genproto"
	"google.golang.org/grpc"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/test/bufconn"
)

const bufSize = 1024 * 1024

var lis *bufconn.Listener

func init() {
	lis = bufconn.Listen(bufSize)
	s := grpc.NewServer()
	pb.RegisterWordsServiceServer(s, &server{})
	healthpb.RegisterHealthServer(s, &server{})
	go func() {
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Server exited with error: %v", err)
		}
	}()
}

func bufDialer(context.Context, string) (net.Conn, error) {
	return lis.Dial()
}

func TestGetWordsNormal(t *testing.T) {
	ctx := context.Background()
	conn, err := grpc.DialContext(ctx, "bufnet", grpc.WithContextDialer(bufDialer), grpc.WithInsecure())
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	client := pb.NewWordsServiceClient(conn)

	category := pb.Category_NORMAL

	res, err := client.GetWords(ctx, &pb.WordsRequest{
		Category: category,
	})
	if err != nil {
		t.Fatal(err)
	}

	if res.Category != category {
		t.Fatal("The requested category does not match")
	}

	if res.GetWords() == nil || len(res.GetWords()) < 1 {
		t.Fatal("No words were provided in the response")
	}
}

func TestGetWordsUnknown(t *testing.T) {
	ctx := context.Background()
	conn, err := grpc.DialContext(ctx, "bufnet", grpc.WithContextDialer(bufDialer), grpc.WithInsecure())
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	client := pb.NewWordsServiceClient(conn)

	_, err = client.GetWords(ctx, &pb.WordsRequest{
		Category: pb.Category_UNKNOWN_CATEGORY,
	})
	if err == nil {
		t.Fatal(err)
	}
}

func TestCheck(t *testing.T) {
	ctx := context.Background()
	conn, err := grpc.DialContext(ctx, "bufnet", grpc.WithContextDialer(bufDialer), grpc.WithInsecure())
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	client := healthpb.NewHealthClient(conn)

	res, err := client.Check(ctx, &healthpb.HealthCheckRequest{})
	if err != nil {
		t.Fatal(err)
	}

	if res.Status != healthpb.HealthCheckResponse_SERVING {
		t.Fatal("Healthcheck returned the wrong status: " + res.GetStatus().String())
	}
}
