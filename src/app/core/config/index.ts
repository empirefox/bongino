import { APP_INITIALIZER } from '@angular/core';
import { api, config, IProfile, qrConfig } from './config';
import { ConfigService } from './config.service';

export { api, config, IProfile, qrConfig } from './config';
export { ConfigService } from './config.service';
export { jwtConfig, xstorageConfig } from '../share';

export function configInitializerFactory(config: ConfigService): any {
  return () => config.init();
}

export const CONFIG_PROVIDERS = [
  ConfigService,
  {
    provide: APP_INITIALIZER,
    useFactory: configInitializerFactory,
    deps: [ConfigService],
    multi: true,
  },
];
