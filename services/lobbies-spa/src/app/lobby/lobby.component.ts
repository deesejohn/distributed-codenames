import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LobbiesService } from '../lobbies.service';
import { Lobby } from '../lobby';
import { PlayerService } from '../player.service';

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

  startGame(): void {
    this.lobbiesService.startGame(this.lobbyId).subscribe();
  }
}
