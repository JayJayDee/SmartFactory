import { Modules } from './modules';
import { MysqlConfig, HttpConfig, Config } from './types';
import { injectable } from '../lib';

injectable(Modules.MysqlConfig,
  [],
  async (): Promise<MysqlConfig> => {
    await delay(0.5);
    return {
      host: '127.0.0.1',
      port: 3306,
      database: 'dummy-db',
      user: 'jaydee',
      password: '12345'
    };
  });

injectable(Modules.HttpConfig,
  [],
  async (): Promise<HttpConfig> => {
    await delay(0.7);
    return { port: 8080 };
  });

injectable(Modules.Config,
  [Modules.HttpConfig, Modules.MysqlConfig],
  async (http: HttpConfig, mysql: MysqlConfig): Promise<Config> => {
    return { http, mysql };
  });

injectable(Modules.A,
  [Modules.B],
  async (b: any) => {});

injectable(Modules.B,
  [Modules.C],
  async (c: any) => {});

injectable(Modules.C,
  [Modules.A],
  async (a: any) => {});
  

const delay = (sec: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  })