# smart-factory
Simple dependancy injector for node.js.  
dependancy injection library for not only classes but also functions, strings, numbers, ... and all objects in the world.

## features
- simple syntax, easy to use
- lightweight
- built-in typescript supports

## installation
```
npm i smart-factory
```

## simple usage
### typescript + es2015
```typescript
import factory, { injectable, resolve } from 'smart-factory';

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
    });

injectable(
  Modules.MSG_PRINTER,
  [],
  async () : Promise<MsgPrinter> =>
    (msg: string) => console.log(msg);

injectable(
   Modules.HELLO_FUNC,
   [ Modules.MSG_PROVIDER, Modules.MSG_PRINTER ], // has dependancies to MsgProvider, MsgPrinter
   async (provider: MsgProvider, printer: MsgPrinter): HelloFunction =>
     (lang: string) => {
       printer(provider(lang));
     });

(async () => {
  await factory();

  const helloFunc = resolve<HelloFunction>(Modules.HELLO_FUNC);
  helloFunc('es'); // HOLA!
})();
```

## API reference
TBD