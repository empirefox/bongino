import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { api } from '../config';
import { Crud, CrudService } from '../crud';
import { IWxPayArgs, MoneyService } from '../money';
import {
  IOrder,
  IOrderPayPayload,
  IOrderWxPayPayload,
  IOrderChangeStatePayload,
} from './order';
import { ICheckout, toPayload } from './checkout';

@Injectable()
export class OrderService extends Crud<IOrder> {

  constructor(
    private moneyService: MoneyService,
    crudService: CrudService) {
    super(crudService, {
      cache: 'orders',
      find: api.GetOrders,
      save: null,
      get: api.GetOrder,
      delete: null,
    });
  }

  checkout(checkout: ICheckout): Observable<IOrder> {
    let payload = toPayload(checkout);
    return this.http.post(api.PostCheckout, JSON.stringify(payload)).mergeMap(res => this.addToCache(res.json()));
  }

  changeState(order: IOrder, state: number): Observable<IOrder> {
    let payload: IOrderChangeStatePayload = { ID: order.ID, State: state };
    return this.http.post(api.PostOrderState, JSON.stringify(payload)).mergeMap(res => this.updateCache(order.ID, res.json()));
  }

  pay(order: IOrder, key: string): Observable<IOrder> {
    let pay: IOrderPayPayload = {
      Key: key,
      OrderID: order.ID,
      Amount: order.PayAmount,
    };
    return this.http.post(api.PostOrderPay, JSON.stringify(pay)).mergeMap(res => this.updateCache(order.ID, res.json()));
  }

  wxPay(order: IOrder): Observable<IOrder> {
    let pay: IOrderWxPayPayload = { OrderID: order.ID };
    return this.http.post(api.PostOrderWxPay, JSON.stringify(pay)).
      mergeMap(res => this.moneyService.requestPay(<IWxPayArgs>res.json())).
      mergeMap(_ => this.http.get(api.PostOrderPaied(order.ID))).
      mergeMap(res => this.updateCache(order.ID, res.json()));
  }

  getOrders(): Observable<IOrder[]> {
    return this.find();
  }

  getOrder(id: number): Observable<IOrder> {
    return this.get(id);
  }

  save(t: IOrder): Observable<IOrder> {
    throw new Error('save is disabled');
  }

  delete(id: number): Observable<any> {
    throw new Error('delete is disabled');
  }

}
