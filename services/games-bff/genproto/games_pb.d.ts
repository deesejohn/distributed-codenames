// package: distributed_codenames
// file: games.proto

import * as jspb from "google-protobuf";

export class Card extends jspb.Message {
  getCardId(): string;
  setCardId(value: string): void;

  getLabel(): string;
  setLabel(value: string): void;

  getColor(): ColorMap[keyof ColorMap];
  setColor(value: ColorMap[keyof ColorMap]): void;

  getRevealed(): boolean;
  setRevealed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    cardId: string,
    label: string,
    color: ColorMap[keyof ColorMap],
    revealed: boolean,
  }
}

export class Clue extends jspb.Message {
  getWord(): string;
  setWord(value: string): void;

  getNumber(): number;
  setNumber(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Clue.AsObject;
  static toObject(includeInstance: boolean, msg: Clue): Clue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Clue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Clue;
  static deserializeBinaryFromReader(message: Clue, reader: jspb.BinaryReader): Clue;
}

export namespace Clue {
  export type AsObject = {
    word: string,
    number: number,
  }
}

export class Game extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  getHostId(): string;
  setHostId(value: string): void;

  clearBlueTeamList(): void;
  getBlueTeamList(): Array<Player>;
  setBlueTeamList(value: Array<Player>): void;
  addBlueTeam(value?: Player, index?: number): Player;

  getBlueTeamSpymaster(): string;
  setBlueTeamSpymaster(value: string): void;

  clearRedTeamList(): void;
  getRedTeamList(): Array<Player>;
  setRedTeamList(value: Array<Player>): void;
  addRedTeam(value?: Player, index?: number): Player;

  getRedTeamSpymaster(): string;
  setRedTeamSpymaster(value: string): void;

  clearBoardList(): void;
  getBoardList(): Array<Card>;
  setBoardList(value: Array<Card>): void;
  addBoard(value?: Card, index?: number): Card;

  clearKeyList(): void;
  getKeyList(): Array<Card>;
  setKeyList(value: Array<Card>): void;
  addKey(value?: Card, index?: number): Card;

  getGuessing(): string;
  setGuessing(value: string): void;

  hasClue(): boolean;
  clearClue(): void;
  getClue(): Clue | undefined;
  setClue(value?: Clue): void;

  getWinner(): string;
  setWinner(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Game.AsObject;
  static toObject(includeInstance: boolean, msg: Game): Game.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Game, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Game;
  static deserializeBinaryFromReader(message: Game, reader: jspb.BinaryReader): Game;
}

export namespace Game {
  export type AsObject = {
    gameId: string,
    hostId: string,
    blueTeamList: Array<Player.AsObject>,
    blueTeamSpymaster: string,
    redTeamList: Array<Player.AsObject>,
    redTeamSpymaster: string,
    boardList: Array<Card.AsObject>,
    keyList: Array<Card.AsObject>,
    guessing: string,
    clue?: Clue.AsObject,
    winner: string,
  }
}

export class Player extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): void;

  getNickname(): string;
  setNickname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Player.AsObject;
  static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Player;
  static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
  export type AsObject = {
    playerId: string,
    nickname: string,
  }
}

export class CreateGameRequest extends jspb.Message {
  getHostId(): string;
  setHostId(value: string): void;

  clearBlueTeamList(): void;
  getBlueTeamList(): Array<Player>;
  setBlueTeamList(value: Array<Player>): void;
  addBlueTeam(value?: Player, index?: number): Player;

  clearRedTeamList(): void;
  getRedTeamList(): Array<Player>;
  setRedTeamList(value: Array<Player>): void;
  addRedTeam(value?: Player, index?: number): Player;

  getVocabularyId(): string;
  setVocabularyId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGameRequest): CreateGameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGameRequest;
  static deserializeBinaryFromReader(message: CreateGameRequest, reader: jspb.BinaryReader): CreateGameRequest;
}

export namespace CreateGameRequest {
  export type AsObject = {
    hostId: string,
    blueTeamList: Array<Player.AsObject>,
    redTeamList: Array<Player.AsObject>,
    vocabularyId: string,
  }
}

export class CreateGameResponse extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateGameResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateGameResponse): CreateGameResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateGameResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateGameResponse;
  static deserializeBinaryFromReader(message: CreateGameResponse, reader: jspb.BinaryReader): CreateGameResponse;
}

export namespace CreateGameResponse {
  export type AsObject = {
    gameId: string,
  }
}

export class GetGameRequest extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetGameRequest): GetGameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGameRequest;
  static deserializeBinaryFromReader(message: GetGameRequest, reader: jspb.BinaryReader): GetGameRequest;
}

export namespace GetGameRequest {
  export type AsObject = {
    gameId: string,
  }
}

export class GetGameResponse extends jspb.Message {
  hasGame(): boolean;
  clearGame(): void;
  getGame(): Game | undefined;
  setGame(value?: Game): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGameResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetGameResponse): GetGameResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGameResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGameResponse;
  static deserializeBinaryFromReader(message: GetGameResponse, reader: jspb.BinaryReader): GetGameResponse;
}

export namespace GetGameResponse {
  export type AsObject = {
    game?: Game.AsObject,
  }
}

export class HintRequest extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  getPlayerId(): string;
  setPlayerId(value: string): void;

  hasClue(): boolean;
  clearClue(): void;
  getClue(): Clue | undefined;
  setClue(value?: Clue): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HintRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HintRequest): HintRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HintRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HintRequest;
  static deserializeBinaryFromReader(message: HintRequest, reader: jspb.BinaryReader): HintRequest;
}

export namespace HintRequest {
  export type AsObject = {
    gameId: string,
    playerId: string,
    clue?: Clue.AsObject,
  }
}

export class HintResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HintResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HintResponse): HintResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HintResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HintResponse;
  static deserializeBinaryFromReader(message: HintResponse, reader: jspb.BinaryReader): HintResponse;
}

export namespace HintResponse {
  export type AsObject = {
  }
}

export class GuessRequest extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  getPlayerId(): string;
  setPlayerId(value: string): void;

  getCardId(): string;
  setCardId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GuessRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GuessRequest): GuessRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GuessRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GuessRequest;
  static deserializeBinaryFromReader(message: GuessRequest, reader: jspb.BinaryReader): GuessRequest;
}

export namespace GuessRequest {
  export type AsObject = {
    gameId: string,
    playerId: string,
    cardId: string,
  }
}

export class GuessResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GuessResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GuessResponse): GuessResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GuessResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GuessResponse;
  static deserializeBinaryFromReader(message: GuessResponse, reader: jspb.BinaryReader): GuessResponse;
}

export namespace GuessResponse {
  export type AsObject = {
  }
}

export class SkipTurnRequest extends jspb.Message {
  getGameId(): string;
  setGameId(value: string): void;

  getPlayerId(): string;
  setPlayerId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SkipTurnRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SkipTurnRequest): SkipTurnRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SkipTurnRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SkipTurnRequest;
  static deserializeBinaryFromReader(message: SkipTurnRequest, reader: jspb.BinaryReader): SkipTurnRequest;
}

export namespace SkipTurnRequest {
  export type AsObject = {
    gameId: string,
    playerId: string,
  }
}

export class SkipTurnResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SkipTurnResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SkipTurnResponse): SkipTurnResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SkipTurnResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SkipTurnResponse;
  static deserializeBinaryFromReader(message: SkipTurnResponse, reader: jspb.BinaryReader): SkipTurnResponse;
}

export namespace SkipTurnResponse {
  export type AsObject = {
  }
}

export interface ColorMap {
  UNKNOWN_COLOR: 0;
  BLUE: 1;
  RED: 2;
  BEIGE: 3;
  BLACK: 4;
}

export const Color: ColorMap;

