import { ProductService } from './product.service';

export * from './eval';
export * from './product';
export * from './product.service';

export const PRODUCT_PROVIDERS = [
  ProductService,
];
