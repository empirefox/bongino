import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HeadComponent } from './head/head.component';
import { PhoneComponent } from './phone/phone.component';
import { PaykeyComponent } from './paykey/paykey.component';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
  ],
  declarations: [HeadComponent, PhoneComponent, PaykeyComponent, UserComponent]
})
export class UserModule { }
