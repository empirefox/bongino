import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as countdown from 'countdown';

@Injectable()
export class CountdownService {

  sms: Subject<number>;

  isSmsColding() { return !!this.sms; }

  coldSms() {
    return this._coldSms(60);
  }

  private _coldSms(sec: number) {
    if (!this.sms) {
      this.sms = new Subject<number>();

      let timerId = countdown(
        (ts) => this.sms.next(ts.seconds),
        new Date(Date.now() + sec * 1000),
        countdown.SECONDS,
      );

      setTimeout(() => {
        clearInterval(<number>timerId);
        this.sms.complete();
        this.sms = null;
      }, sec * 1000);
    }
    return this.sms;
  }

}
