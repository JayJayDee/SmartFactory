import { resolveFunc, injectableFunc, readyFunc } from './container';
import searchFunc from './module-resolver';
import loggerFunc from './logger';
import { Candidate, ContainerOptions } from './types';

const candidates: Candidate[] = [];
const instanceMap = new Map<string, any>();

const options: ContainerOptions = {
  debug: false,
  excludes: ['node_modules/']
};

const initializer = (srcOptions: ContainerOptions) =>
  async (inputedOpts?: ContainerOptions): Promise<void> => {
    if (inputedOpts) {
      if (inputedOpts.debug) srcOptions.debug = inputedOpts.debug;
      if (inputedOpts.includes) srcOptions.includes = inputedOpts.includes;
      if (inputedOpts.excludes) srcOptions.excludes = inputedOpts.excludes;
    }

    const logger = loggerFunc(srcOptions);
    const ready = readyFunc(srcOptions, logger, candidates, instanceMap);

    if (srcOptions.includes) {
      const search = searchFunc(srcOptions, logger);
      await search(srcOptions.includes, srcOptions.excludes);
    }
    await ready();
  };

const resolve = resolveFunc(options, instanceMap);
const injectable = injectableFunc(options, candidates);
const init = initializer(options);
export {
  resolve, injectable, init
}