import { injectable } from '../lib';
import { HttpConfig } from './types';
import { Modules } from './modules';

injectable(Modules.EndpointRunner,
  [ Modules.HttpConfig ],
  async (cfg: HttpConfig) => {
    return {};
  });