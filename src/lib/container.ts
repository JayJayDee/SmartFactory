import { sortBy, reject, includes, some, uniq, filter } from 'lodash';
import { CyclicReferenceError, SelfReferenceError, DuplicateModuleKeyError } from './errors';
import { Candidate, Instantiator, Injectable, ContainerOptions } from './types';

// container initializer factory.
export const initFunc = (srcOpts: ContainerOptions) =>
  (inputedOpts?: ContainerOptions) => {
    if (!inputedOpts) return;
    if (inputedOpts.debug) srcOpts.debug = inputedOpts.debug;
    if (inputedOpts.excludes) srcOpts.excludes = inputedOpts.excludes;
    if (inputedOpts.includes) srcOpts.includes = inputedOpts.includes;
  };

// container module-registerer factory.
export const injectableFunc = (
  srcOpts: ContainerOptions,
  candidates: Candidate[]) =>
    async <T>(key: string, deps: string[], instantiator: Instantiator) => {
      candidates.push({ key, deps, instantiator });
      return new Injectable<T>(key);
    };

// container ready awaiting function factory.
export const readyFunc = (
  srcOpts: ContainerOptions,
  candidates: Candidate[],
  instances: Map<string, any>) =>
    async () => {
      const sorted = sortBy(candidates, (cand) => cand.deps.length);
      const numCandidates = sorted.length;

      checkKeyDuplicates(sorted);
      checkCyclicReference(sorted);
      checkSelfReference(sorted);

      let loopCount = 0;
      while (instances.size < numCandidates) {
        const cand = sorted.pop();
        loopCount++;
        if (loopCount > numCandidates * (numCandidates - 1)) {
          throw new CyclicReferenceError(`cyclic reference found: ${cand.key}`);
        }
        const depInsts = cand.deps.map((name: string) => instances.get(name));
        if (reject(depInsts).length > 0) {
          sorted.unshift(cand);
          continue;
        }
        const instance = await cand.instantiator.apply(this, depInsts);
        instances.set(cand.key, instance);
      }
    };

// module from container resolver function factory.
export const resolveFunc = (
  srcOpts: ContainerOptions,
  instances: Map<string, any>) =>
    <T> (key: string): T => {
      return instances.get(key);
    };



const checkCyclicReference = (arr: Candidate[]) => {
  let expr = null;
  const cyclics = subsets(arr, 2).map((subset) => {
    const cross = crossReference(subset[0], subset[1]);
    if (cross === true) {
      expr = `${subset[0].key}, ${subset[1].key}`;
    }
    return cross;
  });
  if (some(cyclics)) throw new CyclicReferenceError(`cyclic reference found: ${expr}`);
}

const checkSelfReference = (arr: Candidate[]) => {
  let moduleName = null;
  const selfs = arr.map((elem) => {
    const selfRef = selfReference(elem);
    if (selfRef === true) moduleName = elem.key;
    return selfRef;
  });
  if (some(selfs)) throw new SelfReferenceError(`self reference found: ${moduleName}`);
};

const checkKeyDuplicates = (arr: Candidate[]) => {
  const duplciates = duplicateKeys(arr);
  if (duplciates.length > 0) {
    throw new DuplicateModuleKeyError(`duplicated key found: ${duplciates[0]}`);
  }
};

const duplicateKeys = (arr: Candidate[]): string[] =>
  uniq(arr.map((elem) => elem.key)).map((key: string) =>
    filter(arr, (elem) => elem.key === key).length === 1 ? null : key)
    .filter((elem) => (elem));

const selfReference = (a: Candidate) =>
  includes(a.deps, a.key);

const crossReference = (a: Candidate, b: Candidate): boolean =>
  includes(a.deps, b.key) && includes(b.deps, a.key);

const subsets = (arr: any[], n: number): any[][] =>
  arr
  .reduce(
    (subsets, value) => subsets.concat(
      subsets.map((set: any) => [value,...set])
    ), [[]]
  ).filter((subset: any[]) => subset.length === n);