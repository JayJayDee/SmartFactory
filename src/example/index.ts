import { ready, resolve, search } from "../lib";
import { Modules } from './modules';
import { RunEndpointFunction } from './endpoints-runner';
import { Config } from './types';

(async () => {
  // container configuration.
  await search(`${__dirname}/**/*.ts`);
  await ready();

  // run application with resolved modules from container.
  const runServer = resolve<RunEndpointFunction>(Modules.EndpointsRunner);
  const cfg = resolve<Config>(Modules.Config);
  await runServer();
  console.log(`app running on port ${cfg.http.port}`);
})();