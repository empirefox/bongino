import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { jwtConfig } from '../share';
import { JwtService } from './jwt.service';

export { JwtService }

export function authHttpFactory(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: jwtConfig.accessTokenKey,
    tokenGetter: () => new Promise(
      (resolve, reject) => resolve(localStorage.getItem(jwtConfig.accessTokenKey))
    ),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
    noJwtError: true,
  }), http);
}

export const JWT_PROVIDERS = [
  JwtService,
  {
    provide: AuthHttp,
    useFactory: authHttpFactory,
    deps: [Http],
  }
];
