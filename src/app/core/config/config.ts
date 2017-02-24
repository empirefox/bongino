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
}

export const config = Object.assign({
  headImgVerKey: 'head-img-ver',
  wxLoginFailedUrl: `${environment.publicOrigin}/loginfailed`,
  wxExchangeCodeUrl: `${environment.apiOrigin}/oauth/wechat`,
  wxOauthLocalPath: `oauth/weixin`,
  wxOauthLocalUrl: `${environment.publicOrigin}/oauth/weixin`,
}, environment);

export const api = apis(environment.apiOrigin, environment.apiExt);
