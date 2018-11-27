import * as glob from 'glob';
import { flatten } from 'lodash';

const search = async (...searchPaths: string[]) => {
  const rawPaths = await Promise.all(searchPaths.map((expr: string) => globPromise(expr)));
  flatten(rawPaths).map((path: string) => {
    return require(path);
  });
};
export default search;

const globPromise = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(path, (err: Error, files: string[]) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};