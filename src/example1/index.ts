import { init, injectable, resolve } from '../lib';

export enum Modules {
  HELLO_FUNC = 'HELLO_FUNC',
  MSG_PROVIDER = 'MSG_PROVIDER',
  MSG_PRINTER = 'MSG_PRINTER'
}

export type MsgProvider = (lang: string) => string;
export type MsgPrinter = (msg: string) => void;
export type HelloFunction = (lang: string) => void;

injectable(
  Modules.MSG_PROVIDER, // module name
  [], // dependancies
  async (): Promise<MsgProvider> =>
    (lang: string): string => {
      if (lang === 'en') return 'HELLO!';
      else if (lang === 'ko') return '안녕하세요!';
      else if (lang === 'es') return 'HOLA!';
      return 'UNKOWN LANGUAGE';
    });

injectable(
  Modules.MSG_PRINTER,
  [],
  async () : Promise<MsgPrinter> =>
    (msg: string) => console.log(msg));

injectable(
   Modules.HELLO_FUNC,
   [ Modules.MSG_PROVIDER, Modules.MSG_PRINTER ], // has dependancies to MsgProvider, MsgPrinter
   async (provider: MsgProvider, printer: MsgPrinter): Promise<HelloFunction> =>
     (lang: string) => {
       printer(provider(lang));
     });

(async () => {
  await init();

  const helloFunc = resolve<HelloFunction>(Modules.HELLO_FUNC);
  helloFunc('es'); // HOLA!
})();