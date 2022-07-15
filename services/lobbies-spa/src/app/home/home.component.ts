import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LobbiesService } from '../core/lobbies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly lobbiesService: LobbiesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  createLobby(): void {
    this.lobbiesService
      .createLobby()
      .subscribe(lobbyId => this.router.navigateByUrl('/' + lobbyId));
  }
}
