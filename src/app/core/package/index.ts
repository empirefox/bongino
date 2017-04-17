import { PackageService } from './package.service';
import { PackageResolver } from './package.resolver';

export * from './package';
export * from './package.service';
export * from './package.resolver';

export const PACKAGE_PROVIDERS = [
  PackageService,
  PackageResolver,
];
