import { flatten } from 'lodash';
import { ContainerOptions, ContainerLogger } from './types';

export type GlobPromise = (path: string, excludes?: string[]) => Promise<string[]>;

const searchFunc = (
  opts: ContainerOptions,
  logger: ContainerLogger,
  globPromise: GlobPromise) =>
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