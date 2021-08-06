import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpTransportType } from '@microsoft/signalr';
import { defer, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Lobby } from './lobby';

@Injectable({
  providedIn: 'root',
})
export class LobbiesService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly http: HttpClient
  ) {}

  public changeTeam(lobbyId: string, playerId: string): Observable<void> {
    return this.http.post<void>(
      `/api/lobbies/${lobbyId}/player/${playerId}/change_team/`,
      {},
      { withCredentials: true }
    );
  }

  public createLobby(): Observable<string> {
    return this.http.post(
      '/api/lobbies/',
      {},
      {
        responseType: 'text',
        withCredentials: true,
      }
    );
  }

  public startGame(lobbyId: string): Observable<void> {
    return this.http.post<void>(
      `/api/lobbies/${lobbyId}/start_game/`,
      {},
      { withCredentials: true }
    );
  }

  public streamLobby(
    lobbyId: string,
    autoRedirect?: boolean
  ): Observable<Lobby> {
    return defer(() => {
      return new Observable<Lobby>(observer => {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`/api/lobbies/session?lobby_id=${lobbyId}`, {
            transport: HttpTransportType.WebSockets,
            withCredentials: true,
          })
          .build();
        connection.on('LobbyUpdated', (lobby: Lobby) => observer.next(lobby));
        connection.start();
        return () => connection.stop();
      }).pipe(
        tap(lobby => {
          if (autoRedirect && !!lobby.game_id) {
            this.document.location.assign(`/games/${lobby.game_id}/`);
          }
        })
      );
    });
  }
}
