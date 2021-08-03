import * as grpc from '@grpc/grpc-js';
import { GamesServiceClient } from './genproto/games_grpc_pb';
import {
  Card as GrpcCard,
  Clue as GrpcClue,
  Game as GrpcGame,
  GetGameRequest,
  GuessRequest,
  HintRequest,
  PlayAgainRequest,
  Player as GrpcPlayer,
  SkipTurnRequest,
} from './genproto/games_pb';
import { Card, Game, Player } from './models';

class GameClient {
  private readonly gameClient: GamesServiceClient;

  constructor(host: string) {
    this.gameClient = new GamesServiceClient(
      host,
      grpc.credentials.createInsecure()
    );
  }

  public get = (gameId: string): Promise<Game | null> => {
    const request = new GetGameRequest();
    request.setGameId(gameId);
    return new Promise<Game | null>((resolve, reject) => {
      this.gameClient.getGame(request, (err, data) => {
        if (err) {
          return reject(err);
        }
        const game = data?.getGame()?.toObject();
        if (!game) {
          return resolve(null);
        }
        return resolve(GameClient.mapGame(game));
      });
    });
  };

  public guess = (
    gameId: string,
    playerId: string,
    cardId: string
  ): Promise<void> => {
    const request = new GuessRequest();
    request.setGameId(gameId);
    request.setPlayerId(playerId);
    request.setCardId(cardId);
    return new Promise<void>((resolve, reject) => {
      this.gameClient.guess(request, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };

  public hint = (
    gameId: string,
    playerId: string,
    clue: { number: number; word: string }
  ): Promise<void> => {
    const request = new HintRequest();
    request.setGameId(gameId);
    request.setPlayerId(playerId);
    const requestClue = new GrpcClue();
    requestClue.setNumber(clue.number);
    requestClue.setWord(clue.word);
    request.setClue(requestClue);
    return new Promise<void>((resolve, reject) => {
      this.gameClient.hint(request, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };

  public playAgain = (gameId: string, playerId: string): Promise<void> => {
    const request = new PlayAgainRequest();
    request.setGameId(gameId);
    request.setPlayerId(playerId);
    return new Promise<void>((resolve, reject) => {
      this.gameClient.playAgain(request, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };

  public skipTurn = (gameId: string, playerId: string): Promise<void> => {
    const request = new SkipTurnRequest();
    request.setGameId(gameId);
    request.setPlayerId(playerId);
    return new Promise<void>((resolve, reject) => {
      this.gameClient.skipTurn(request, err => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  };

  public static mapCard = (dto: GrpcCard.AsObject): Card => ({
    card_id: dto.cardId,
    label: dto.label,
    color: dto.color,
    revealed: dto.revealed,
  });

  public static mapPlayer = (dto: GrpcPlayer.AsObject): Player => ({
    player_id: dto.playerId,
    nickname: dto.nickname,
  });

  public static mapGame = (dto: GrpcGame.AsObject): Game => ({
    game_id: dto.gameId,
    host_id: dto.hostId,
    blue_team: dto.blueTeamList.map(GameClient.mapPlayer),
    blue_team_spymaster: dto.blueTeamSpymaster,
    red_team: dto.redTeamList.map(GameClient.mapPlayer),
    red_team_spymaster: dto.redTeamSpymaster,
    board: dto.boardList.map(GameClient.mapCard),
    key: dto.keyList.map(GameClient.mapCard),
    guessing: dto.guessing,
    clue: {
      word: String(dto.clue?.word),
      number: Number(dto.clue?.number),
    },
    winner: dto.winner,
  });
}

export default GameClient;
