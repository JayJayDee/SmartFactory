# smart-factory
Simple dependancy injector for node.js, Typescript.

## Simple usage
```
// types 
interface User {
  name: string;
  age: number;
}
type UserFetchFunction = (id: string) => Promise<User>;

// implemented factory function
const fetch = (mysql: Mysql): UserFetchFunction =>
  async (id: string) =>
    mysql.query('SELECT * FROM user WHERE id=?', [id]);

// container
injectable('UserFetch', // module name 
  [ MysqlDriver ], // dependancies
  async (mysql: Mysql): Promise<UserFetchFunction> => 
    fetch(mysql));

// resolve modules from container in other places
const fetchFunction = resolve<UserFetchFunction>('UserFetch');
await fetchFunction();
```