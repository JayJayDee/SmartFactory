export enum Modules {
  Config = 'Config',
  EndpointRunner = 'EndpointRunner',
  UserModel = 'UserModel'
}

export type Config = {
  port: number;
  host: string;
};