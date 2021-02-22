#!/bin/sh
PATH=$PATH:$GOPATH/bin
OUT=genproto

[ -d $OUT ] || mkdir $OUT
rm -f $OUT/*.pb.go

protoc --go_out=$OUT --go_opt=paths=source_relative \
  --go-grpc_out=$OUT --go-grpc_opt=paths=source_relative \
  --proto_path=../../protos words.proto
