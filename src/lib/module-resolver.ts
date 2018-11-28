import * as glob from 'glob';
import { flatten } from 'lodash';
import { ContainerOptions, ContainerLogger } from './types';

const searchFunc = (
  opts: ContainerOptions,
  logger: ContainerLogger) =>
    async (includes: string[], excludes?: string[]) => {
      const rawPaths = await Promise.all(
        includes.map((expr: string) => globPromise(expr, excludes)));
      const modules = flatten(rawPaths).map((path: string) => {
        require(path);
        return null;
      });
      logger.debug(`* searched ${modules.length} modules`);
    };
export default searchFunc;

const globPromise = (path: string, excludes?: string[]): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const opts: glob.IOptions = {};
    if (excludes) opts.ignore = excludes;
    glob(path, opts, (err: Error, files: string[]) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};