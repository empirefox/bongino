import { environment } from '../../../environments/environment';
import { apis } from '../api';

export interface IProfile {
  WxMpName: string;
  Phone: string;
  DefaultHeadImage: string;
  IntroVipDetail: string;
  IntroVipPrivilege: string;
  IntroCarInsurance: string;

  WxAppId: string;
  WxScope: string;
  WxLoginPath: string;

  EvalTimeoutDay: number;
  CompleteTimeoutDay: number;
  HistoryTimeoutDay: number;
  CheckoutExpiresMinute: number;
  WxPayExpiresMinute: number;
  FreeDeliverLine: number;

  HeadPrefix: string;
  QrLogoUrl: string;
}

export const config = Object.assign({
  headImgVerKey: 'head-img-ver',
  wxLoginFailedUrl: `${environment.publicOrigin}/loginfailed`,
  wxExchangeCodeUrl: `${environment.apiOrigin}/oauth/wechat`,
  wxOauthLocalPath: `oauth/weixin`,
  wxOauthLocalUrl: `${environment.publicOrigin}/oauth/weixin`,
}, environment);

export const api = apis(environment.apiOrigin, environment.apiExt);

export interface QrConfig {
  TypeNumber: number;
  CellSize: number;
  ColorFore: string;
  ColorBack: string;
  ColorOut: string;
  ColorIn: string;
  LogoSize: number;
  LogoClearEdges: number;
  LogoMargin: number;
}

export const qrConfig: QrConfig = {
  TypeNumber: 1,
  CellSize: 6,
  ColorFore: '#222',
  ColorBack: '#fff',
  ColorOut: '#222',
  ColorIn: '#222',
  LogoSize: 15,
  LogoClearEdges: 2,
  LogoMargin: 0,
};
