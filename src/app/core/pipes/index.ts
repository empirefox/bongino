import { GEN_PIPES } from '../api';
import { AgoPipe } from './ago.pipe';
import { CdnImgPipe } from './cdn-img.pipe';
import { MoneyPipe, YuanPipe, CentPipe } from './money.pipe';

export { AgoPipe } from './ago.pipe';
export { CdnImgPipe } from './cdn-img.pipe';
export { MoneyPipe, YuanPipe, CentPipe } from './money.pipe';

export const APP_CORE_PIPES = [
  ...GEN_PIPES,
  AgoPipe,
  CdnImgPipe,
  MoneyPipe, YuanPipe, CentPipe,
];
