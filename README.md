# smart-factory
[![npm version](https://badge.fury.io/js/smart-factory.svg)](https://badge.fury.io/js/smart-factory)



Simple but powerful, functional-programming ready Dependency Injector/Container library for node.js.

dependency injection library for not only classes but also functions, strings, numbers, ... and all objects in the world.


# features
- simple syntax, easy to use
- functional-programming ready
- lightweight
- built-in typescript supports
- supports lazy-instantiation

# installation
```
npm i smart-factory
```

# simple usage
## javascript + es6
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
  [ModuleNames.MSG_PROVIDER, ModuleNames.MSG_PRINTER], // required dependencies
  (provider, printer) => // dependencies which injected from container
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
## typescript + es2015
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
  [], // dependencies
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
   [ Modules.MSG_PROVIDER, Modules.MSG_PRINTER ], // has dependencies to MsgProvider, MsgPrinter
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

# API reference
## async init(opts?: ContainerOptions): Promise\<void>
initialize container. after init() executed, you can retreive a modules from container.
### type ContainerOptions
| key | mandantory | default | description |
| --- | --- | -- | -- |
| debug?: boolean | no | false | show container logs. for debug purpose. |
| includes?: string[] | no | null | specify path for modules which calls injectable(). |
| excludes?: string[] | no | null | specify path for exceptional modules. |
### example
```typescript
(async () => {
  await init({
    debug: true,
    includes: [`${__dirname}/**/*.ts`]
  });
})();
```
##  injectable(key: string, deps: string[], instantiator: Instantiator): void
register modules to container. the dependencies ```deps[]``` will be injeted before the module instantiated.


after all dependencies meets requirements, the modules will be instantiated and registered to container with name ```key```.


the ```instantiator``` is your async function that preparing instance from given dependencies ```deps[]```.
### example
```typescript
type Coffee = {
  bean: CoffeeBean;
  water: Water;
  sugar: Sugar;
};
type CoffeeMaker = () => Coffee;

injectable(
  'COFFEE_MAKER', // module name
  [ 'COFFEE_BEAN', 'WATER', 'SUGAR' ], // required dependencies
  async (bean, water, sugar): Promise<CoffeeMaker> => // the "Instantiator": returns coffeeMaker function. 
    () => { // coffeeMaker function
      return {
        bean, water, sugar
      }
    }
);
```
## resolve\<T>(key: string): \<T>
resolves module from container. with typescript, you can specify type.
### example
```typescript
(async () => {
  const makeCoffee = await <CoffeeMaker>resolve('COFFEE_MAKER');
  const coffee = makeCoffee();
  console.log(coffee); // { bean, water, sugar }!
})();
```
## set\<T>(key: string, instance: T): void
replace an instance in container with given key and instance. you can use this feature in the test codes.
```typescript
(async () => {
  injectable('A', [], async () => 10);
  await init(); // container initialized.

  const value = <number>resolve('A');
  console.log(value); // "10"

  set('A', 20);
  const valueAfterSet = <number>resolve('A');
  console.log(valueAfterSet); // "20"
})();
```
## clear(): void
clear all instances in container
```typescript
(async () => {
  injectable('A', [], async () => 10);
  await init(); // container initialized.

  const value = <number>resolve('A');
  console.log(value); // "10"

  clear(); // nothing in container.
})();
```

# More complicated examples
There are a more complicated examples that using smart-factory. you can learn how to manage complicated dependencies (ex: configuration, database, models..) for complicated application with the smart-factory.


- [Chatpot-Room-Server](https://github.com/JayJayDee/Chatpot-Room-Server)
  - chatting-room server written with Typescript, smart-factory
  - configurations, mysql, models, api endpoints
  - shows handling modules names and types with typescript way.