import { IPackage } from '../package';
import { ICheckoutPayload } from './order';

export interface ICheckout {
  Package: IPackage;
  Quantity: number;
  Total: number;
  Remark?: string;
}

export function toPayload(checkout: ICheckout): ICheckoutPayload {
  let { Package, Quantity, Remark, Total } = checkout; // tslint:disable-line:variable-name
  let data: ICheckoutPayload = {
    PackageID: Package.ID,
    Quantity,
    Total,
  };
  if (Remark) {
    data.Remark = Remark;
  }
  return data;
}
