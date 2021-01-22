import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LobbyComponent } from './lobby/lobby.component';
import { NicknameGuard } from './nickname.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [NicknameGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: ':id', component: LobbyComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
