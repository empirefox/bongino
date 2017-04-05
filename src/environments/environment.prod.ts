import { EnvArgs } from './args';

export const environment: EnvArgs = {
  production: true,
  publicOrigin: 'https://www.luck2.com',
  apiOrigin: 'https://api.luck2.com',
  wxCodeEndpoint: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  qiniuUphost: 'https://up.qbox.me',
  cdnImgOrigin: 'https://head.luck2.com',
  qrLogoUrl: '',
  fakeToken: false,
  firebase: {
    apiKey: 'AIzaSyC4mOkOIiMfgzrKE5oIMvI51FJaMZ7DwKA',
    authDomain: 'ng2-admin-lte-a3958.firebaseapp.com',
    databaseURL: 'https://ng2-admin-lte-a3958.firebaseio.com',
    messagingSenderId: '201342590340',
    storageBucket: 'ng2-admin-lte-a3958.appspot.com'
  },
};
