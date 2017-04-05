import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonSchemaFormModule } from 'angular2-json-schema-form/src';

import { MyRoutingModule } from './my-routing.module';
import { ResourceComponent } from './resource/resource.component';
import { FansComponent } from './fans/fans.component';
import { QrComponent } from './qr/qr.component';
import { OrderComponent } from './order/order.component';

@NgModule({
  imports: [
    CommonModule,
    JsonSchemaFormModule,
    MyRoutingModule,
  ],
  declarations: [ResourceComponent, FansComponent, QrComponent, OrderComponent]
})
export class MyModule { }
