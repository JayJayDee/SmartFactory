import { resolveFunc, injectableFunc, readyFunc } from './container';
import searchFunc from './module-resolver';
import loggerFunc from './logger';
import { Candidate, ContainerOptions } from './types';

const candidates: Candidate[] = [];
const instanceMap = new Map<string, any>();

const options: ContainerOptions = {
  debug: false,
  includes: ['**/*'],
  excludes: ['node_modules/']
};

const resolve = resolveFunc(options, instanceMap);
const injectable = injectableFunc(options, candidates);
export {
  resolve, injectable
}

export default async (opts?: ContainerOptions): Promise<void> => {
  if (opts) {
    if (opts.debug) options.debug = opts.debug;
    if (opts.includes) options.includes = opts.includes;
    if (opts.excludes) options.excludes = opts.excludes;
  }

  const logger = loggerFunc(opts);
  const ready = readyFunc(options, logger, candidates, instanceMap);
  const search = searchFunc(options, logger);

  await search(options.includes, options.excludes);
  await ready();
};