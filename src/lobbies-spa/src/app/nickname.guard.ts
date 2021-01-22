import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root'
})
export class NicknameGuard implements CanActivate {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly playerService: PlayerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let playerId = this.playerService.getPlayerId();
    if (!playerId) {
      this.document.location.assign(
        `/players?redirect_uri=${this.document.location.pathname}`
      );
    }
    return true;
  }

}
