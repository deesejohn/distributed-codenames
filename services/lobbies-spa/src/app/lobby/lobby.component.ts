import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LobbiesService } from '../lobbies.service';
import { Lobby } from '../lobby';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {
  readonly connection: signalR.HubConnection;
  readonly lobby$: BehaviorSubject<Lobby | undefined>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly lobbiesService: LobbiesService,
    private readonly playerService: PlayerService,
    private readonly route: ActivatedRoute,
  ) {
    const lobbyId = this.route.snapshot.paramMap.get('id') || '';
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/api/lobbies/session?lobby_id=' + lobbyId, {
        transport: HttpTransportType.WebSockets,
        withCredentials: true
      })
      .build();
    this.lobby$ = new BehaviorSubject<Lobby | undefined>(undefined);
  }

  ngOnInit(): void {
    this.lobby$
      .pipe(
        filter(lobby => !!lobby?.game_id)
      )
      .subscribe(lobby => this.redirectToGame(lobby?.game_id as string));
    this.connection.on("LobbyUpdated",
      (lobby: Lobby) => this.lobby$.next(lobby)
    );
    this.connection.start();
  }

  ngOnDestroy(): void {
    this.connection.stop();
  }

  changeTeam(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id');
    const playerId = this.playerService.getPlayerId();
    if (lobbyId && playerId) {
      this.lobbiesService.changeTeam(lobbyId, playerId).subscribe();
    }
  }

  redirectToGame(gameId: string): void {
    this.document.location.assign(`/games/${gameId}`);
  }

  startGame(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id') || '';
    this.lobbiesService.startGame(lobbyId).subscribe();
  }
}
