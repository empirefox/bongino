import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GEN_PIPES } from '../core/api';
import { AgoPipe } from './ago.pipe';
import { CdnImgPipe } from './cdn-img.pipe';
import { MoneyPipe, YuanPipe, CentPipe } from './money.pipe';

const pipes = [
  ...GEN_PIPES,
  AgoPipe,
  CdnImgPipe,
  MoneyPipe, YuanPipe, CentPipe,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ...pipes,
  ],
  exports: [
    ...pipes,
  ]
})
export class AppPipeModule { }
