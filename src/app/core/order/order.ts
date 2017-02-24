import { ISku, IEvalItem } from '../product';
import { IWxPayArgs } from '../money';

export interface IOrder extends IEvalItem {
  ID: number;
  Remark: string;

  ProductID: number;
  SkuID: number;
  Quantity: number;
  Price: number;
  Name: string;
  Img: string;
  Attrs: string;

  PayAmount: number;
  WxPaid: number;
  WxRefund: number;
  CashPaid: number;
  CashRefund: number;
  RefundReason: string;

  State: number;
  CreatedAt: number;
  CanceledAt: number;
  PrepaidAt: number;
  PaidAt: number;
  RejectedAt: number;
  EnsuredAt: number;
  RefundAt: number;
  CompletedAt: number;
  EvalAt: number;
  HistoryAt: number;

  NeedEnsure: boolean;
  AutoCompleted: boolean;
  AutoEvaled: boolean;
}

export interface ICheckoutPayload {
  SkuID: number;
  Quantity: number;
  Total: number;
  Remark?: string;
}

export interface IOrderChangeStatePayload {
  ID: number;
  State: number;
}

export interface IOrderWxPayPayload {
  OrderID: number;
}

export interface IOrderPrepayResponse {
  Order: IOrder; // without items
  WxPayArgs: IWxPayArgs;
}

export interface IOrderPayPayload {
  Key: string;
  OrderID: number;
  Amount: number;
}
