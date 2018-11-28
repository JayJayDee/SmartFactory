import { injectable } from '../lib';
import { HttpConfig } from './types';
import { Modules } from './modules';
import { Endpoint } from './endpoints-user';

injectable(Modules.EndpointsRunner,
  [
    Modules.HttpConfig,
    Modules.UserEndpoints
  ],
  async (
    cfg: HttpConfig,
    userEndpoints: Endpoint[]) => {
    return {};
  });