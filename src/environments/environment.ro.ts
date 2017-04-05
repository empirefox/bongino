import { EnvArgs } from './args';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment: EnvArgs = {
  production: false,
  publicOrigin: 'http://127.0.0.1:4200',
  apiOrigin: 'http://127.0.0.1:4200/fixture/api',
  apiExt: '.json',
  siteExt: '.json',
  wxCodeEndpoint: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  qiniuUphost: 'https://up.qbox.me',
  cdnImgOrigin: 'http://head.luck2.com',
  qrLogoUrl: '',
  fakeToken: true,
  showErr: true,
  silent: false,
  firebase: {
    apiKey: 'AIzaSyC4mOkOIiMfgzrKE5oIMvI51FJaMZ7DwKA',
    authDomain: 'ng2-admin-lte-a3958.firebaseapp.com',
    databaseURL: 'https://ng2-admin-lte-a3958.firebaseio.com',
    messagingSenderId: '201342590340',
    storageBucket: 'ng2-admin-lte-a3958.appspot.com'
  },
};
