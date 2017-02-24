import { FansService } from './fans.service';
import { FansResolver } from './fans.resolver';

export * from './fans';
export * from './fans.service';
export * from './fans.resolver';

export const FANS_PROVIDERS = [
  FansService,
  FansResolver,
];
