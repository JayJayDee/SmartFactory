import { bean } from "../lib";
import { Modules } from './types';

export default bean(Modules.Config, [], async () => {
  await delay1sec();
  return {
    
  };
});

const delay1sec = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  })