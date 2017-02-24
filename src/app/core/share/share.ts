import { environment } from '../../../environments/environment';

export const jwtConfig = {
  accessTokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  oauth2StateKey: 'state',
  currentUrlKey: 'current_url',
  authResult: 'auth_result',
  localUserKey: 'local_user_key',
};

export const xstorageConfig = {
  xstorageHubUrl: `${environment.publicOrigin}/xstorage/public-hub.html`,
  loginFailedUrl: `${environment.publicOrigin}/loginfailed`,
  exchangeCodeUrl: (provider: string) => `${environment.apiOrigin}/oauth/${provider}`,
};
