import { Pipe, PipeTransform } from '@angular/core';

import { config } from '../config';

@Pipe({ name: 'cdnImg' })
export class CdnImgPipe implements PipeTransform {
  transform(value: string) {
    return !value.indexOf('https://') || !value.indexOf('http://') || !value.indexOf('//') ?
      value : `${config.cdnImgOrigin}/${value}`;
  }
}
