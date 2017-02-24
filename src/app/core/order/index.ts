import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';

export * from './checkout';
export * from './order';
export * from './order.service';
export * from './order.resolver';

export const ORDER_PROVIDERS = [
  OrderService,
  OrderResolver,
];
