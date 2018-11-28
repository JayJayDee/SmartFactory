import { resolveFunc, injectableFunc, readyFunc } from './container';
import search from './module-resolver';
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
const ready = readyFunc(options, candidates, instanceMap);

export {
  resolve, injectable, ready, search
}