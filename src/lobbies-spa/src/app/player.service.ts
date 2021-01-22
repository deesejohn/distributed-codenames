import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    @Inject(DOCUMENT) private readonly document: Document
  ) { }

  public getPlayerId(): string | undefined {
    return this.document.cookie
      ?.split('; ')
      ?.find(row => row.startsWith('player_id'))
      ?.split('=')[1];
  }
}
