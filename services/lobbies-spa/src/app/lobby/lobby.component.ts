import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LobbiesService } from '../core/lobbies.service';
import { Lobby } from '../core/lobby';
import { PlayerService } from '../core/player.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  readonly lobbyId: string;
  readonly lobby$: Observable<Lobby>;

  constructor(
    private readonly lobbiesService: LobbiesService,
    private readonly playerService: PlayerService,
    private readonly route: ActivatedRoute
  ) {
    this.lobbyId = this.route.snapshot.paramMap.get('id') || '';
    this.lobby$ = this.lobbiesService.streamLobby(this.lobbyId, true);
  }

  changeTeam(): void {
    const playerId = this.playerService.getPlayerId();
    if (playerId) {
      this.lobbiesService.changeTeam(this.lobbyId, playerId).subscribe();
    }
  }

  canStart = (lobby: Lobby) =>
    this.teamsAreEven(lobby) &&
    this.teamsAreBothTwoPus(lobby) &&
    this.playerService.getPlayerId() === lobby.host_id;

  startGame(): void {
    this.lobbiesService.startGame(this.lobbyId).subscribe();
  }

  teamsAreBothTwoPus = (lobby: Lobby) =>
    lobby.blue_team.length >= 2 && lobby.red_team.length >= 2;

  teamsAreEven = (lobby: Lobby) =>
    lobby.blue_team.length === lobby.red_team.length;
}
