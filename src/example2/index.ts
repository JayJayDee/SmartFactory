import { init, resolve } from "../lib";
import * as express from 'express';
import { RunEndpointFunction } from './endpoints-runner';
import { Modules } from './modules';
import { Config } from './types';

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
  const cfg = resolve<Config>(Modules.Config);
  await runServer();
  console.log(`app running on port ${cfg.http.port}`);
})();