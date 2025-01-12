#!/bin/sh
out=genproto

[ -d $out ] || mkdir $out
rm -f $out/*.pb.go

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

protoc --go_out=$out --go_opt=paths=source_relative \
  --go-grpc_out=$out --go-grpc_opt=paths=source_relative \
  --proto_path=../../protos games.proto words.proto
