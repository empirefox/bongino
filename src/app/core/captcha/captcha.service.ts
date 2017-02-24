import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { api } from '../config';
import { RetryHttp } from '../user';
import { ICaptcha } from './captcha';

@Injectable()
export class CaptchaService {

  constructor(private http: RetryHttp) { }

  getCaptcha(): Observable<ICaptcha> {
    return this.http.get(api.GetCaptcha).map(res => {
      let captcha = <ICaptcha>res.json();
      captcha.data = `data:image/png;base64,${captcha.Base64}`;
      delete captcha.Base64;
      return captcha;
    });
  }

}
