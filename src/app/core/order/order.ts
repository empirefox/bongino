import { IWxPayArgs } from '../money';

export interface IOrder {
  ID: number;
/**@tr zh:"备注"*/ Remark: string;

  PackageID: number;
/**@tr zh:"单位"*/ Unit: string;
/**@tr zh:"数量"*/ Quantity: number;
/**@tr zh:"单价"*/ Price: number;
/**@tr zh:"名称"*/ Name: string;

/**@tr zh:"金额"*/ PayAmount: number;
  WxPaid: number;
  WxRefund: number;
  CashPaid: number;
  CashRefund: number;
  RefundReason: string;

/**@tr zh:"状态"*/ State: number;
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
  PackageID: number;
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
