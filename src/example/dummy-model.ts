import { Modules } from './modules';
import { injectable } from '../lib';
import { MysqlDriver } from './dummy-mysql';

export type UserModel = {
  list: (offset: number, size: number) => Promise<User[]>;
};
export type User = {
  no: number;
  name: string;
  age: number;
};

injectable(Modules.UserModel,
  [Modules.MysqlDriver],
  async (mysql: MysqlDriver): Promise<UserModel> => {
    return {
      list: listUser(mysql)
    }
  });

const listUser = (mysql: MysqlDriver) =>
  async (offset: number, size: number): Promise<User[]> => {
    const rows = await mysql.query('SELECT * FROM users LIMIT ?,?', [offset, size]);
    return rows.map((row: any) => {
      return {
        no: 1,
        name: 'Test',
        age: 29
      };
    });
  };