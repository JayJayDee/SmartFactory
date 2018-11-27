import { ready, resolve } from "../lib";
import { Config } from './types';
import { Modules } from './modules';

export default async () => {
  await ready();
  console.log('app ready!');
  const cfg = resolve<Config>(Modules.Config);
  console.log(cfg);
};