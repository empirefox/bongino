import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IFan } from './fans';
import { FansService } from './fans.service';

@Injectable()
export class FansResolver implements Resolve<IFan[]> {

  constructor(private fansService: FansService) { }

  resolve(): Observable<IFan[]> {
    return this.fansService.getItems();
  }

}
