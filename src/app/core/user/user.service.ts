import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { api, config, ConfigService } from '../config';
import { JwtService } from '../jwt';
import { nonce } from '../util';
import {
  ISetUserInfoPayload,
  IUserInfo,
  ISetUserInfoResponse,
  IPreBindPhonePayload,
  IBindPhonePayload,
  ISetPaykeyPayload,
} from './user';
import { TokenService } from './token.service';
import { RetryHttp } from './retry-http';

@Injectable()
export class UserService {

  private headSrc: Observable<string>;
  private headNonce: string = nonce(4);
  private headPrefix: string;

  constructor(
    private router: Router,
    private rawHttp: Http,
    private http: RetryHttp,
    private configService: ConfigService,
    private jwt: JwtService,
    private tokenService: TokenService) {
    this.headPrefix = this.configService.config.HeadPrefix || '';
  }

  get headSrc$(): Observable<string> {
    if (!this.headSrc) {
      this.headNonce = nonce(4);
      this.headSrc = this.getUserinfo().take(1).
        map((user: IUserInfo) => `${config.cdnImgOrigin}/${this.headPrefix}/${user.ID}?v=${this.headNonce}`).
        publishReplay(1).refCount();
    }
    return this.headSrc;
  }

  refreshHead() {
    this.headSrc = null;
  }

  getUserinfo(): Observable<IUserInfo> {
    return this.tokenService.getUserinfo();
  }

  setUserinfo(writable: ISetUserInfoPayload): Observable<IUserInfo> {
    let user$ = this.http.post(api.PostSetUserInfo, JSON.stringify(writable)).flatMap(res => {
      return this.getUserinfo().flatMap(info => {
        let data = <ISetUserInfoResponse>res.json();
        info.UpdatedAt = data.UpdatedAt;
        return Observable.of(Object.assign({}, info));
      });
    }).publishReplay(1).refCount();
    return this.tokenService._userinfo = user$;
  }

  // return times can be sent
  // tslint:disable-next-line:variable-name
  preBindPhone(Phone: string): Observable<number> {
    let payload: IPreBindPhonePayload = { Phone };
    return this.http.post(api.PostPrebindPhone, JSON.stringify(payload)).map(res => <number>res.json());
  }

  bindPhone(payload: IBindPhonePayload): Observable<string> {
    payload.RefreshToken = this.jwt.refreshToken;
    return this.http.post(api.PostBindPhone, JSON.stringify(payload)).
      flatMap(res => this.tokenService._updateToken(res.json()));
  }

  preSetPaykey() {
    return this.getUserinfo().flatMap(info => {
      if (!info.Phone) {
        return Observable.throw('Phone not binded');
      }
      return this.http.post(api.PostPresetPaykey, '');
    });
  }

  setPaykey(payload: ISetPaykeyPayload) {
    return this.getUserinfo().flatMap(info => {
      if (!info.Phone) {
        return Observable.throw('Phone not binded');
      }
      return this.http.post(api.PostSetPaykey, JSON.stringify(payload)).flatMap(_ => {
        info.HasPayKey = true;
        return this.tokenService._userinfo = Observable.of(Object.assign({}, info)).publishReplay(1).refCount();
      });
    });
  }

}
