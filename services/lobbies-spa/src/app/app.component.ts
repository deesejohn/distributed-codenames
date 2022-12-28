import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public readonly playersUrl: string;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.playersUrl = `/players?redirect_uri=${this.document.location.pathname}`;
  }
}
