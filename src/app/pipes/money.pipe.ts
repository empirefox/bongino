import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NumberWrapper } from '@angular/core/src/facade/lang';

// import { ISku, IProduct } from '../product';

// export interface Pricer {
//   Price?: number;
//   sku?: ISku;
//   skus?: ISku[];
//   product?: IProduct;
// }

const moneyBase = new DecimalPipe('zh-CN');

// Cannot read property 'product' of undefined: value is null!!!
// @Pipe({ name: 'price' })
// export class PricePipe implements PipeTransform {
//   // accept number, sku or any object which has Price
//   transform(value: Pricer) {
//     if (!value) {
//       return '**';
//     }
//     let sku: ISku;
//     let skus: ISku[];
//     let price: number;
//     if (NumberWrapper.isNumeric(value)) {
//       price = value as any as number;
//     } else if (value.Price) {
//       price = value.Price;
//     } else if (sku = value.sku) {
//       price = sku.Price;
//     } else if (skus = value.skus || (value.product && value.product.skus) || []) {
//       sku = skus[0];
//       if (!sku) {
//         return '--';
//       }
//       price = sku.Price;
//     }
//     return NumberWrapper.isNumeric(price) ? moneyBase.transform(price / 100, '1.2-2') : '--';
//   }
// }

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number) {
    return moneyBase.transform((value ? value : 0) / 100, '1.2-2');
  }
}

@Pipe({ name: 'yuan' })
export class YuanPipe implements PipeTransform {
  transform(value: number) {
    return moneyBase.transform((value ? value : 0) / 100, '1.2-2').slice(0, -3);
  }
}

@Pipe({ name: 'cent' })
export class CentPipe implements PipeTransform {
  transform(value: number) {
    return moneyBase.transform((value ? value : 0) / 100, '1.2-2').slice(-3);
  }
}
