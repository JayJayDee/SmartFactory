import { bean, ready, resolve } from "../lib";

enum ModuleName {
  DependConfig = 'DependConfig',
  DependModule = 'DependModule',
  DependModule2 = 'DependModule2',
  DependFunction = 'DependFunction',
  DependFunction2 = 'DependFunction2',
  
  Module1 = 'Module1',
  Module2 = 'Module2'
}

type DummyCfg = {
  port: number;
};
type DependFunction = (id: string) => Promise<string>;
type DependFunction2 = () => Promise<string>;
type DependModule = {
  test: () => string;
};
type DependModule2 = {
  depModule2: () => Promise<string>;
};
type Module1 = () => Promise<void>;

bean(ModuleName.DependModule, [], async () => {
  const dependModule: DependModule = {
    test() {
      return 'test';
    }
  };
  return dependModule;
});

bean(ModuleName.DependFunction2,
  [ModuleName.DependConfig],
  async (cfg: DummyCfg): Promise<DependFunction2> =>
    () => { 
      return new Promise((resolve, reject) => {
        resolve(`config was ${cfg.port}`);
      });
    });

bean(ModuleName.DependFunction, [], async (): Promise<DependFunction> =>
  (id: string): Promise<string> =>
    new Promise((resolve, reject) => {
      resolve('test2');
    }));

bean(ModuleName.DependConfig, [], async (): Promise<DummyCfg> => ({
  port: 80
}));

bean(ModuleName.DependModule2,
  [ModuleName.DependFunction2, ModuleName.DependConfig],
  async (depFunc2: DependFunction2, cfg: DummyCfg): Promise<DependModule2> => ({
    async depModule2() {
      const res = await depFunc2();
      return `string from depMod2 ${res}${cfg.port}`;
    }
  }));

const instance = (cfg: DummyCfg, depFunc: DependFunction, depMod: DependModule): Module1 =>
  async () => {
    console.log(`configuration: ${cfg.port}`);

    const result = await depFunc('test2');
    console.log(`execution result1: ${result}`);

    const result2 = depMod.test();
    console.log(`execution result2: ${result2}`);
  }

bean(ModuleName.Module1,
  [ModuleName.DependConfig,
  ModuleName.DependFunction, 
  ModuleName.DependModule],
  async (cfg: DummyCfg,
    depFunc: DependFunction,
    depMod: DependModule) => {
    return instance(cfg, depFunc, depMod);
  });

setTimeout(async () => {
  await ready();
  const mod = resolve<DependModule2>(ModuleName.DependModule2);
  const result = await mod.depModule2();
  console.log(result);
}, 1000);