import * as express from 'express'; 
import { Router } from 'express';
import { injectable } from '../lib';
import { HttpConfig } from './types';
import { Modules } from './modules';

export type RunEndpointFunction = () => Promise<void>;

injectable(Modules.EndpointsRunner,
  [
    Modules.HttpConfig,
    Modules.UserEndpoints
  ],
  async (cfg: HttpConfig, userEndpoints: Router) =>
    runAll(cfg, userEndpoints));
 
const runAll = (cfg: HttpConfig, userEndpoints: Router) =>
  async () => {
    const app = express();
    app.use('/user', userEndpoints);
    app.listen(cfg.port);
  };