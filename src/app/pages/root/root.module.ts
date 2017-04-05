import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { AlertModule, DatepickerModule } from 'ng2-bootstrap';
import { JsonSchemaFormModule } from 'angular2-json-schema-form/src';
import { Ng2SmdInputModule } from 'ng2-ef-inputs';

import { AppPipeModule } from '../../pipes';
import { RootRoutingModule } from './root-routing.module';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';
import { PackageComponent } from './package/package.component';

import { PageNumComponent } from './page-num/page-num.component';
import { ClientComponent } from './client/client.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    AlertModule,
    DatepickerModule,
    JsonSchemaFormModule,
    Ng2SmdInputModule,
    AppPipeModule,
    RootRoutingModule,
  ],
  declarations: [
    ContactComponent,
    HomeComponent,
    PageComponent,
    PackageComponent,

    PageNumComponent,
    ClientComponent,
  ],
  exports: [
    TreeModule,
  ]
})
export class RootModule { }
