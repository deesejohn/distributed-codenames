// GENERATED CODE -- DO NOT EDIT!

// package: distributed_codenames
// file: games.proto

import * as games_pb from "./games_pb";
import * as grpc from "@grpc/grpc-js";

interface IGamesServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  createGame: grpc.MethodDefinition<games_pb.CreateGameRequest, games_pb.CreateGameResponse>;
  getGame: grpc.MethodDefinition<games_pb.GetGameRequest, games_pb.GetGameResponse>;
  guess: grpc.MethodDefinition<games_pb.GuessRequest, games_pb.GuessResponse>;
  hint: grpc.MethodDefinition<games_pb.HintRequest, games_pb.HintResponse>;
  playAgain: grpc.MethodDefinition<games_pb.PlayAgainRequest, games_pb.PlayAgainResponse>;
  skipTurn: grpc.MethodDefinition<games_pb.SkipTurnRequest, games_pb.SkipTurnResponse>;
}

export const GamesServiceService: IGamesServiceService;

export interface IGamesServiceServer extends grpc.UntypedServiceImplementation {
  createGame: grpc.handleUnaryCall<games_pb.CreateGameRequest, games_pb.CreateGameResponse>;
  getGame: grpc.handleUnaryCall<games_pb.GetGameRequest, games_pb.GetGameResponse>;
  guess: grpc.handleUnaryCall<games_pb.GuessRequest, games_pb.GuessResponse>;
  hint: grpc.handleUnaryCall<games_pb.HintRequest, games_pb.HintResponse>;
  playAgain: grpc.handleUnaryCall<games_pb.PlayAgainRequest, games_pb.PlayAgainResponse>;
  skipTurn: grpc.handleUnaryCall<games_pb.SkipTurnRequest, games_pb.SkipTurnResponse>;
}

export class GamesServiceClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  createGame(argument: games_pb.CreateGameRequest, callback: grpc.requestCallback<games_pb.CreateGameResponse>): grpc.ClientUnaryCall;
  createGame(argument: games_pb.CreateGameRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.CreateGameResponse>): grpc.ClientUnaryCall;
  createGame(argument: games_pb.CreateGameRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.CreateGameResponse>): grpc.ClientUnaryCall;
  getGame(argument: games_pb.GetGameRequest, callback: grpc.requestCallback<games_pb.GetGameResponse>): grpc.ClientUnaryCall;
  getGame(argument: games_pb.GetGameRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.GetGameResponse>): grpc.ClientUnaryCall;
  getGame(argument: games_pb.GetGameRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.GetGameResponse>): grpc.ClientUnaryCall;
  guess(argument: games_pb.GuessRequest, callback: grpc.requestCallback<games_pb.GuessResponse>): grpc.ClientUnaryCall;
  guess(argument: games_pb.GuessRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.GuessResponse>): grpc.ClientUnaryCall;
  guess(argument: games_pb.GuessRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.GuessResponse>): grpc.ClientUnaryCall;
  hint(argument: games_pb.HintRequest, callback: grpc.requestCallback<games_pb.HintResponse>): grpc.ClientUnaryCall;
  hint(argument: games_pb.HintRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.HintResponse>): grpc.ClientUnaryCall;
  hint(argument: games_pb.HintRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.HintResponse>): grpc.ClientUnaryCall;
  playAgain(argument: games_pb.PlayAgainRequest, callback: grpc.requestCallback<games_pb.PlayAgainResponse>): grpc.ClientUnaryCall;
  playAgain(argument: games_pb.PlayAgainRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.PlayAgainResponse>): grpc.ClientUnaryCall;
  playAgain(argument: games_pb.PlayAgainRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.PlayAgainResponse>): grpc.ClientUnaryCall;
  skipTurn(argument: games_pb.SkipTurnRequest, callback: grpc.requestCallback<games_pb.SkipTurnResponse>): grpc.ClientUnaryCall;
  skipTurn(argument: games_pb.SkipTurnRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.SkipTurnResponse>): grpc.ClientUnaryCall;
  skipTurn(argument: games_pb.SkipTurnRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<games_pb.SkipTurnResponse>): grpc.ClientUnaryCall;
}
