#!/bin/sh
PATH=$PATH:$GOPATH/bin
out=genproto

[ -d $out ] || mkdir $out
rm -f $out/*.pb.go

protoc --go_out=$out --go_opt=paths=source_relative \
  --go-grpc_out=$out --go-grpc_opt=paths=source_relative \
  --proto_path=../../protos games.proto words.proto
