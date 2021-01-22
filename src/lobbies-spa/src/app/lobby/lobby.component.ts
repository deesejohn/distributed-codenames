import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
export class LobbyComponent implements OnInit {
  lobby$: BehaviorSubject<Lobby | undefined>;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly lobbiesService: LobbiesService,
    private readonly playerService: PlayerService,
    private readonly route: ActivatedRoute,
  ) {
    this.lobby$ = new BehaviorSubject<Lobby | undefined>(undefined);
  }

  ngOnInit(): void {
    this.lobby$
      .pipe(
        filter(lobby => !!lobby?.game_id)
      )
      .subscribe(lobby => this.redirectToGame(lobby?.game_id as string));

    const lobbyId = this.route.snapshot.paramMap.get('id') || '';
    let connection = new signalR.HubConnectionBuilder()
      .withUrl('/api/lobbies/session?lobby_id=' + lobbyId, {
        transport: HttpTransportType.WebSockets,
        withCredentials: true
      })
      .build();

    connection.on("LobbyUpdated",
      (lobby: Lobby) => this.lobby$.next(lobby)
    );

    connection.start()
        .then(() => console.log('js connected'));
  }

  changeTeam(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id') || '';
    const playerId = this.playerService.getPlayerId() || '';
    this.lobbiesService.changeTeam(lobbyId, playerId).subscribe();
  }

  redirectToGame(gameId: string): void {
    this.document.location.assign(`/games/${gameId}`);
  }

  startGame(): void {
    const lobbyId = this.route.snapshot.paramMap.get('id') || '';
    this.lobbiesService.startGame(lobbyId).subscribe();
  }
}
