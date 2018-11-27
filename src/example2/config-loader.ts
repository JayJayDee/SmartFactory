import { bean } from "../lib";
import { Modules, Config } from './types';

export default bean(Modules.Config, [], async (): Promise<Config> => {
  await delay1sec();
  return {
    port: 8080,
    host: '127.0.0.1'
  };
});

const delay1sec = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  })