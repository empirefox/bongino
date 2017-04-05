import { Pipe, PipeTransform } from '@angular/core';
import { NumberWrapper } from '@angular/core/src/facade/lang';
import Timeago from 'timeago.js';

@Pipe({ name: 'ago' })
export class AgoPipe implements PipeTransform {
  base = new Timeago(null, 'zh_CN'); // not zh-CN
  transform(value: Date | number) {
    return NumberWrapper.isNumeric(value) ? this.base.format(<number>value * 1000) : this.base.format(value);
  }
}
