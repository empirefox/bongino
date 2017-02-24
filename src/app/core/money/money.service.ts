import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { api } from '../config';
import { RetryHttp } from '../user';
import { one2manyRelate } from '../util';
import {
  IUserCash, Cashes,
  IUserCashFrozen, Frozen,
  IUserCashRebate, IUserCashRebateItem, Rebates,
  IPointsItem, Points,
  IWxPayArgs, WithdrawPayload,
} from './money';

declare var WeixinJSBridge;

export const sortor = (b: { CreatedAt: number }, a: { CreatedAt: number }) => a.CreatedAt - b.CreatedAt;

@Injectable()
export class MoneyService {
  private cashes: Observable<Cashes>;
  private frozen: Observable<Frozen>;
  private rebates: Observable<Rebates>;
  private points: Observable<Points>;

  constructor(private http: RetryHttp) { }

  getCashes(refresh = false): Observable<Cashes> {
    if (!this.cashes || refresh) {
      this.cashes = this.http.get(api.GetUserCash).map(res => {
        let items = (<IUserCash[]>res.json() || []).sort(sortor);
        let total = items.length ? items[0].Balance : 0;
        return { items, total };
      }).publishReplay(1).refCount();
    }
    return this.cashes;
  }

  getFrozen(refresh = false): Observable<Frozen> {
    if (!this.frozen || refresh) {
      this.frozen = this.http.get(api.GetUserCashFrozen).map(res => {
        let items = (<IUserCashFrozen[]>res.json() || []).filter(item => !item.ThawedAt).sort(sortor);
        let total = _.sumBy(items, item => item.Amount);
        return { items, total };
      }).publishReplay(1).refCount();
    }
    return this.frozen;
  }

  getRebates(refresh = false): Observable<Rebates> {
    if (!this.rebates || refresh) {
      this.rebates = this.http.get(api.GetUserCashRebate).map(res => {
        let rebates: IUserCashRebate[] = (res.json() || []).filter(item => !item.DoneAt);
        let rebateItems: IUserCashRebateItem[] = [];
        rebates.sort(sortor).forEach(rebate => {
          rebate.Items = rebate.Items || [];
          rebate.Items.sort(sortor).forEach(item => item.rebate = rebate);
          rebateItems = [...rebateItems, ...rebate.Items];
        });
        let rebated = _.sumBy(rebateItems, item => item.Amount);
        let unrebated = _.sumBy(rebates, item => item.Amount) - rebated;
        return { items: rebates, rebated, unrebated };
      }).publishReplay(1).refCount();
    }
    return this.rebates;
  }

  getPoints(refresh = false): Observable<Points> {
    if (!this.points || refresh) {
      this.points = this.http.get(api.GetUserPoints).map(res => {
        let items = (<IPointsItem[]>res.json() || []).sort(sortor);
        let total = items.length ? items[0].Balance : 0;
        return { items, total };
      }).publishReplay(1).refCount();
    }
    return this.points;
  }

  addCash(cashes: Cashes, cash: IUserCash) {
    cashes.items.unshift(cash);
    cashes.total = cashes.items.length ? cashes.items[0].Balance : 0;
  }

  requestPay(payargs: IWxPayArgs): Observable<{}> {
    return Observable.fromPromise(this._requestPay(payargs));
  }

  // WARNING! just add cash to top
  withdraw(amount: number): Observable<IUserCash> {
    let payload: WithdrawPayload = { Amount: amount };
    return this.http.post(api.PostWithdraw, JSON.stringify(payload)).map(res => <IUserCash>res.json());
  }

  private _requestPay(payargs: IWxPayArgs) {
    return new Promise((resolve, reject) => {
      let onBridgeReady = () => {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          payargs,
          (res) => {
            console.log(res)
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              resolve();
            } else {
              reject(res);
            }
          }
        );
      };

      if (typeof WeixinJSBridge === 'undefined') {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, true);
      } else {
        onBridgeReady();
      }
    });
  }

}
