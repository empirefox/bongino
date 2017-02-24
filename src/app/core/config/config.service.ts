import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IProfile, IPage } from 'bongin-base';

import { api, config, IProfile as Profile } from './config';

@Injectable()
export class ConfigService {
  config: typeof config & Profile = <any>config;

  constructor(private http: Http) { }

  init(): any {
    return this.http.get(api.GetProfile).map(res => res.json()).toPromise()
      .then(profile => this.config = Object.assign({}, config, profile))
      .catch(() => {
        throw new Error('Error: remote profile unreachable!');
      });
  }

  wxOauthUrl(redirectUri: string, state: string): string {
    let {WxAppId: appid, WxScope: scope, wxCodeEndpoint} = this.config;
    // tslint:disable:max-line-length
    return `${wxCodeEndpoint}?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }

}
