import { QrService } from './qr.service';
import { QrResolver } from './qr.resolver';

export * from './qr.service';
export * from './qr.resolver';

export const QR_PROVIDERS = [
  QrService,
  QrResolver,
];
