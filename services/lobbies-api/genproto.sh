#!/bin/sh
out=genproto

[ -d $out ] || mkdir $out
rm -f $out/*.cs

LATEST_VERSION="$(ls $HOME/.nuget/packages/grpc.tools/ | tail -n1 | tr -d '\n')"
protoc --plugin=protoc-gen-grpc="$HOME/.nuget/packages/grpc.tools/$LATEST_VERSION/tools/linux_x64/grpc_csharp_plugin" \
  --csharp_out=$out \
  --csharp_opt=file_extension=.g.cs \
  --grpc_out=$out \
  --grpc_opt=no_server,file_suffix=Grpc.g.cs \
  --proto_path=../../protos games.proto
