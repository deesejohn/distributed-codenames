#!/bin/bash
OUT=genproto
# Windows users see protoc-gen-ts.cmd and grpc_tools_node_protoc_plugin.cmd
if [ "$OSTYPE" == "cygwin" ] || [ "$OSTYPE" == "msys" ]; then
  PROTOC_GEN_TS_PATH=$(npm bin)\\protoc-gen-ts.cmd
  PROTOC_GEN_GRPC_PATH=$(npm bin)\\grpc_tools_node_protoc_plugin.cmd
else
  PROTOC_GEN_TS_PATH=$(npm bin)/protoc-gen-ts
  PROTOC_GEN_GRPC_PATH=$(npm bin)/grpc_tools_node_protoc_plugin
fi
[ -d $OUT ] || mkdir $OUT
rm -f $OUT/*_pb.js $OUT/*_pb.d.ts

protoc \
  --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
  --plugin=protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH} \
  --js_out="import_style=commonjs,binary:${OUT}" \
  --ts_out="service=grpc-node,mode=grpc-js:${OUT}" \
  --grpc_out="grpc_js:${OUT}" \
  --proto_path=../../protos \
  games.proto