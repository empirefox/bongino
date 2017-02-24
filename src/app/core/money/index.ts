import { MoneyService } from './money.service';
import { CashesResolver, FrozenResolver, RebatesResolver, PointsResolver } from './money.resolver';

export * from './money';
export * from './money.service';
export * from './money.resolver';

export const MONEY_PROVIDERS = [
  MoneyService,
  CashesResolver, FrozenResolver, RebatesResolver, PointsResolver,
];
