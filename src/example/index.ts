import { ready, resolve, search } from "../lib";
import { Config } from './types';
import { Modules } from './modules';

(async () => {
  await search(`${__dirname}/**/*.ts`);
  await ready();
  const cfg = resolve<Config>(Modules.Config);
  console.log(cfg);
})();