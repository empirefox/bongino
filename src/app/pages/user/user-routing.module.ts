import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeadComponent } from './head/head.component';
import { PhoneComponent } from './phone/phone.component';
import { PaykeyComponent } from './paykey/paykey.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'head', component: HeadComponent },
  { path: 'phone', component: PhoneComponent },
  { path: 'paykey', component: PaykeyComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
