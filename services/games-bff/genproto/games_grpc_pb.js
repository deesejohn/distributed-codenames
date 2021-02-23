// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var games_pb = require('./games_pb.js');

function serialize_distributed_codenames_CreateGameRequest(arg) {
  if (!(arg instanceof games_pb.CreateGameRequest)) {
    throw new Error('Expected argument of type distributed_codenames.CreateGameRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_CreateGameRequest(buffer_arg) {
  return games_pb.CreateGameRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_CreateGameResponse(arg) {
  if (!(arg instanceof games_pb.CreateGameResponse)) {
    throw new Error('Expected argument of type distributed_codenames.CreateGameResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_CreateGameResponse(buffer_arg) {
  return games_pb.CreateGameResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_GetGameRequest(arg) {
  if (!(arg instanceof games_pb.GetGameRequest)) {
    throw new Error('Expected argument of type distributed_codenames.GetGameRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_GetGameRequest(buffer_arg) {
  return games_pb.GetGameRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_GetGameResponse(arg) {
  if (!(arg instanceof games_pb.GetGameResponse)) {
    throw new Error('Expected argument of type distributed_codenames.GetGameResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_GetGameResponse(buffer_arg) {
  return games_pb.GetGameResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_GuessRequest(arg) {
  if (!(arg instanceof games_pb.GuessRequest)) {
    throw new Error('Expected argument of type distributed_codenames.GuessRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_GuessRequest(buffer_arg) {
  return games_pb.GuessRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_GuessResponse(arg) {
  if (!(arg instanceof games_pb.GuessResponse)) {
    throw new Error('Expected argument of type distributed_codenames.GuessResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_GuessResponse(buffer_arg) {
  return games_pb.GuessResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_HintRequest(arg) {
  if (!(arg instanceof games_pb.HintRequest)) {
    throw new Error('Expected argument of type distributed_codenames.HintRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_HintRequest(buffer_arg) {
  return games_pb.HintRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_HintResponse(arg) {
  if (!(arg instanceof games_pb.HintResponse)) {
    throw new Error('Expected argument of type distributed_codenames.HintResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_HintResponse(buffer_arg) {
  return games_pb.HintResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_SkipTurnRequest(arg) {
  if (!(arg instanceof games_pb.SkipTurnRequest)) {
    throw new Error('Expected argument of type distributed_codenames.SkipTurnRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_SkipTurnRequest(buffer_arg) {
  return games_pb.SkipTurnRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_distributed_codenames_SkipTurnResponse(arg) {
  if (!(arg instanceof games_pb.SkipTurnResponse)) {
    throw new Error('Expected argument of type distributed_codenames.SkipTurnResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_distributed_codenames_SkipTurnResponse(buffer_arg) {
  return games_pb.SkipTurnResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GamesServiceService = exports.GamesServiceService = {
  createGame: {
    path: '/distributed_codenames.GamesService/CreateGame',
    requestStream: false,
    responseStream: false,
    requestType: games_pb.CreateGameRequest,
    responseType: games_pb.CreateGameResponse,
    requestSerialize: serialize_distributed_codenames_CreateGameRequest,
    requestDeserialize: deserialize_distributed_codenames_CreateGameRequest,
    responseSerialize: serialize_distributed_codenames_CreateGameResponse,
    responseDeserialize: deserialize_distributed_codenames_CreateGameResponse,
  },
  getGame: {
    path: '/distributed_codenames.GamesService/GetGame',
    requestStream: false,
    responseStream: false,
    requestType: games_pb.GetGameRequest,
    responseType: games_pb.GetGameResponse,
    requestSerialize: serialize_distributed_codenames_GetGameRequest,
    requestDeserialize: deserialize_distributed_codenames_GetGameRequest,
    responseSerialize: serialize_distributed_codenames_GetGameResponse,
    responseDeserialize: deserialize_distributed_codenames_GetGameResponse,
  },
  hint: {
    path: '/distributed_codenames.GamesService/Hint',
    requestStream: false,
    responseStream: false,
    requestType: games_pb.HintRequest,
    responseType: games_pb.HintResponse,
    requestSerialize: serialize_distributed_codenames_HintRequest,
    requestDeserialize: deserialize_distributed_codenames_HintRequest,
    responseSerialize: serialize_distributed_codenames_HintResponse,
    responseDeserialize: deserialize_distributed_codenames_HintResponse,
  },
  guess: {
    path: '/distributed_codenames.GamesService/Guess',
    requestStream: false,
    responseStream: false,
    requestType: games_pb.GuessRequest,
    responseType: games_pb.GuessResponse,
    requestSerialize: serialize_distributed_codenames_GuessRequest,
    requestDeserialize: deserialize_distributed_codenames_GuessRequest,
    responseSerialize: serialize_distributed_codenames_GuessResponse,
    responseDeserialize: deserialize_distributed_codenames_GuessResponse,
  },
  skipTurn: {
    path: '/distributed_codenames.GamesService/SkipTurn',
    requestStream: false,
    responseStream: false,
    requestType: games_pb.SkipTurnRequest,
    responseType: games_pb.SkipTurnResponse,
    requestSerialize: serialize_distributed_codenames_SkipTurnRequest,
    requestDeserialize: deserialize_distributed_codenames_SkipTurnRequest,
    responseSerialize: serialize_distributed_codenames_SkipTurnResponse,
    responseDeserialize: deserialize_distributed_codenames_SkipTurnResponse,
  },
};

exports.GamesServiceClient = grpc.makeGenericClientConstructor(GamesServiceService);
