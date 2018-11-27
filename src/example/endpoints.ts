import { injectable } from '../lib';
import { HttpConfig } from './types';
import { Modules } from './modules';

export default injectable(Modules.EndpointRunner,
  [ Modules.HttpConfig ],
  async (cfg: HttpConfig) => {
    return null;
  });