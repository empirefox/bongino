import { Provider } from '@angular/core';
import { FEATHERS_PROVIDERS } from './cache';
import { CAPTCHA_PROVIDERS } from './captcha';
import { CONFIG_PROVIDERS } from './config';
import { CRUD_PROVIDERS } from './crud';
import { FANS_PROVIDERS } from './fans';
import { JWT_PROVIDERS } from './jwt';
import { MODALS_PROVIDERS } from './modal';
import { MONEY_PROVIDERS } from './money';
import { ORDER_PROVIDERS } from './order';
import { PACKAGE_PROVIDERS } from './package';
import { QR_PROVIDERS } from './qr';
import { RESOURCE_PROVIDERS } from './resource';
import { SITE_PROVIDERS } from './site';
import { USER_PROVIDERS } from './user';

export * from './api';
export * from './auth';
export * from './cache';
export * from './captcha';
export * from './config';
export * from './crud';
export * from './fans';
export * from './jwt';
export * from './modal';
export * from './money';
export * from './order';
export * from './package';
export * from './qr';
export * from './resource';
export * from './share';
export * from './site';
export * from './user';

export * from './util';

export const APP_CORE_PROVIDERS: Provider[] = [
  ...FEATHERS_PROVIDERS,
  ...CAPTCHA_PROVIDERS,
  ...CONFIG_PROVIDERS,
  ...CRUD_PROVIDERS,
  ...FANS_PROVIDERS,
  ...JWT_PROVIDERS,
  ...MODALS_PROVIDERS,
  ...MONEY_PROVIDERS,
  ...ORDER_PROVIDERS,
  ...PACKAGE_PROVIDERS,
  ...QR_PROVIDERS,
  ...RESOURCE_PROVIDERS,
  ...SITE_PROVIDERS,
  ...USER_PROVIDERS,
];
