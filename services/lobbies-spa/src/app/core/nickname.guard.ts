import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { PlayerService } from './player.service';

export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerId = inject(PlayerService).getPlayerId();
  const { location } = inject(DOCUMENT);
  if (!playerId) {
    location.assign(`/players?redirect_uri=${location.pathname}`);
  }
  return true;
};
