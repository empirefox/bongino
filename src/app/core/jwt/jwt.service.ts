import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { jwtConfig } from '../share';

@Injectable()
export class JwtService {
  helper = new JwtHelper();

  constructor(private router: Router) { }

  get refreshToken() { return localStorage.getItem(jwtConfig.refreshTokenKey); }
  set refreshToken(token: string) { localStorage.setItem(jwtConfig.refreshTokenKey, token); }

  get accessToken() { return localStorage.getItem(jwtConfig.accessTokenKey); }
  set accessToken(token: string) { localStorage.setItem(jwtConfig.accessTokenKey, token); }

  setOauth2State(state: string) { localStorage.setItem(jwtConfig.oauth2StateKey, state); }
  getOauth2State() {
    let state = localStorage.getItem(jwtConfig.oauth2StateKey);
    localStorage.removeItem(jwtConfig.oauth2StateKey);
    return state;
  }

  setCurrentUrl(u: string) { localStorage.setItem(jwtConfig.currentUrlKey, u); }
  getCurrentUrl() {
    let u = localStorage.getItem(jwtConfig.currentUrlKey);
    localStorage.removeItem(jwtConfig.currentUrlKey);
    return u;
  }

  tokenExpired(token: string, offsetSeconds?: number) {
    try {
      return !token || this.helper.isTokenExpired(token, offsetSeconds);
    } catch (error) {
      return false;
    }
  }

  notExpired() { return !this.tokenExpired(this.accessToken, 10); }
  needUpdate() { return !this.tokenExpired(this.accessToken, 120); }
  canUpdate() { return this.refreshToken; }

}
