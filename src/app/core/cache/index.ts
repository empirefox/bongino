import { FeathersService } from './feathers.service';

export { FeathersService, FeathersFindConfig, FeathersData } from './feathers.service';
export { Cache } from './cache';

export const FEATHERS_PROVIDERS = [
  FeathersService,
];
