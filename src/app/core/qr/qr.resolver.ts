import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QrService } from './qr.service';

@Injectable()
export class QrResolver implements Resolve<string> {

  constructor(private qrService: QrService) { }

  resolve(): Observable<string> {
    return this.qrService.getMyQrDataURL();
  }

}
