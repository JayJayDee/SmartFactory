import { init, resolve } from "../lib";
import * as express from 'express';
import { RunEndpointFunction } from './endpoints-runner';
import { Modules } from './modules';
import {  HttpConfig } from './types';

(async () => {
  // container configuration.
  await init({
    includes: [`${__dirname}/**/*.ts`],
    debug: true
  });

  const app = express();
  app.listen(5000);
  
  // run application with resolved modules from container.
  const runServer = resolve<RunEndpointFunction>(Modules.EndpointsRunner);
  const cfg = resolve<HttpConfig>(Modules.HttpConfig);
  await runServer();
  console.log(`app running on port ${cfg.port}`);
})();