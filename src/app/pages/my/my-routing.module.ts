import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceComponent } from './resource/resource.component';
import { FansComponent } from './fans/fans.component';
import { QrComponent } from './qr/qr.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'resource', component: ResourceComponent },
  { path: 'fans', component: FansComponent },
  { path: 'qr', component: QrComponent },
  { path: 'order', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRoutingModule { }
