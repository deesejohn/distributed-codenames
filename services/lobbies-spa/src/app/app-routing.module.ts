import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';
import { canActivate } from './core/nickname.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [canActivate],
    children: [
      { path: '', component: HomeComponent },
      { path: ':id', component: LobbyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
