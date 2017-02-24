import { ISku } from '../product';
import { ICheckoutPayload } from './order';

export interface ICheckout {
  Sku: ISku;
  Quantity: number;
  Total: number;
  Remark?: string;
}

export function toPayload(checkout: ICheckout): ICheckoutPayload {
  let {Sku, Quantity, Remark, Total} = checkout; // tslint:disable-line:variable-name
  let data: ICheckoutPayload = {
    SkuID: Sku.ID,
    Quantity,
    Total,
  };
  if (Remark) {
    data.Remark = Remark;
  }
  return data;
}
