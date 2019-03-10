import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { BlockchainComponent } from './components/blockchain/blockchain.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "users",
    component: UsersComponent
  },
  {
    path: "wallets",
    component: WalletsComponent
  },
  {
    path: "exchange",
    component: ExchangeComponent
  },
  {
    path: "blockchain",
    component: BlockchainComponent
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
