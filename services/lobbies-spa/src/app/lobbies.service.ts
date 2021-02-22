import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LobbiesService {

  constructor(
    private readonly http: HttpClient
  ) {}

  public createLobby(): Observable<string> {
    return this.http.post('/api/lobbies', {}, {
      responseType: 'text',
      withCredentials: true
    });
  }

  public startGame(lobbyId: string): Observable<void> {
    return this.http.post<void>(
      `/api/lobbies/${lobbyId}/start_game`,
      {},
      { withCredentials: true }
    );
  }

  public changeTeam(lobbyId: string, playerId: string): Observable<void> {
    return this.http.post<void>(
      `/api/lobbies/${lobbyId}/player/${playerId}/change_team`,
      {},
      { withCredentials: true }
    );
  }
}
