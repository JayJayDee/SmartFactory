# smart-factory
[![npm version](https://badge.fury.io/js/smart-factory.svg)](https://badge.fury.io/js/smart-factory)



Simple dependancy injector for node.js.  
dependancy injection library for not only classes but also functions, strings, numbers, ... and all objects in the world.

## features
- simple syntax, easy to use
- lightweight
- built-in typescript supports
- supports lazy-instantiation

## installation
```
npm i smart-factory
```

## simple usage
### javascript + es6
```javascript
const { init, injectable, resolve } = require('smart-factory');

// module names
const ModuleNames = {
  MSG_PROVIDER: 'MSG_PROVIDER',
  MSG_PRINTER: 'MSG_PRINTER',
  GREETER: 'GREETER'
};

// regiser message provider function to container
injectable(ModuleNames.MSG_PROVIDER,
  [], 
  () =>
    new Promise((resolve) => {
      const toBeRegistered = (lang) => { // msgProvider function.
        if (lang === 'en') return 'HELLO!';
        else if (lang === 'ko') return '안녕하세요!';
        else if (lang === 'es') return 'HOLA!';
        return 'UNKNOWN';
      };
      resolve(toBeRegistered);
    }));

// register message printer function to container
injectable(ModuleNames.MSG_PRINTER,
  [], 
  () => 
    new Promise((resolve) => {
      const toBeRegistered = (msg) => console.log(msg); // msgPrinter function
      resolve(toBeRegistered);
    }));

// register greeter function to container.
injectable(ModuleNames.GREETER,
  [ModuleNames.MSG_PROVIDER, ModuleNames.MSG_PRINTER], // required dependancies
  (provider, printer) => // dependancies which injected from container
    new Promise((resolve) => {
      const toBeRegistered = (lang) => { // greeter function.
        printer(provider(lang));
      };
      resolve(toBeRegistered);
    }));

(() => {
  init() // awaiting container ready
    .then(() => {
      const greet = resolve(ModuleNames.GREETER); // injects greeter function from container.
      greet('en'); // HELLO!
    });
})();
```
### typescript + es2015
```typescript
import { init, injectable, resolve } from 'smart-factory';

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
      return 'UNKNOWN';
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
  await init();

  const helloFunc = resolve<HelloFunction>(Modules.HELLO_FUNC);
  helloFunc('es'); // HOLA!
})();
```

## API reference
### async init(opts?: ContainerOptions)
initialize container. after init() executed, you can retreive a modules from container.
#### type ContainerOptions
TBD
### async injectable(key: string, deps: string[], instantiator: Instantiator)
register modules to container.
