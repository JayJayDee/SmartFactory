import * as glob from 'glob-fs';

const search = (...searchPaths: string[]) => {
  searchPaths.map((expr: string) => {
    // console.log(readDirSync(expr));
    console.log(glob({}).readFileSync);
  });
};
export default search;