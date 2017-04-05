import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceComponent } from './balance/balance.component';
import { RewardComponent } from './reward/reward.component';
import { QualificationComponent } from './qualification/qualification.component';
import { PointsComponent } from './points/points.component';

const routes: Routes = [
  { path: 'balance', component: BalanceComponent },
  { path: 'reward', component: RewardComponent },
  { path: 'qualification', component: QualificationComponent },
  { path: 'points', component: PointsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
