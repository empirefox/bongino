import { PackageService } from './package.service';

export * from './package';
export * from './package.service';

export const PACKAGE_PROVIDERS = [
  PackageService,
];
