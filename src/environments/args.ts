export interface IFirebase {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  messagingSenderId: string;
  storageBucket: string;
}

export interface EnvArgs {
  production: boolean;
  publicOrigin: string;
  apiOrigin: string;
  apiExt?: string;
  wxCodeEndpoint: string;
  qiniuUphost: string;
  cdnImgOrigin: string;
  qrLogoUrl?: string;
  fakeToken?: boolean;
  showErr?: boolean;
  silent?: boolean;
  firebase: IFirebase;
}
