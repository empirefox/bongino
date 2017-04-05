import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { RatingModule } from 'ngx-rating';

import { APP_DIRECTIVES } from './directives';

// TODO add components
@NgModule({
  declarations: [
    ...APP_DIRECTIVES,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule,
    BootstrapModalModule,
    RatingModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BootstrapModalModule,
    RatingModule,
    ...APP_DIRECTIVES,
  ],
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
