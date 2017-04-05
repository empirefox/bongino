import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { BalanceComponent } from './balance/balance.component';
import { RewardComponent } from './reward/reward.component';
import { QualificationComponent } from './qualification/qualification.component';
import { PointsComponent } from './points/points.component';

@NgModule({
  imports: [
    CommonModule,
    WalletRoutingModule,
  ],
  declarations: [BalanceComponent, RewardComponent, QualificationComponent, PointsComponent]
})
export class WalletModule { }
