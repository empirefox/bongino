import { GEN_CONST_PIPES } from './consts';
import { GEN_TRANS_PIPES } from './trans';

export { apis } from './api';

export const GEN_PIPES = [
  ...GEN_CONST_PIPES,
  ...GEN_TRANS_PIPES,
];
