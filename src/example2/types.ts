export interface Config {
  http: HttpConfig;
  mysql: MysqlConfig;
}
export interface HttpConfig {
  port: number;
}
export interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}