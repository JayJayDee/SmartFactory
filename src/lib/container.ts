import { sortBy, reject, includes, some, difference, uniq } from 'lodash';
import { CyclicReferenceError, SelfReferenceError, DuplicateModuleKeyError } from './errors';
import { Candidate, Instantiator, Injectable } from './types';

const candidates: Candidate[] = [];
const instanceMap = new Map<string, any>();

export const injectable = async <T>(key: string,deps: string[], instantiator: Instantiator) => {
  candidates.push({ key, deps, instantiator });
  return new Injectable<T>(key);
};

export const ready = async () => {
  const sorted = sortBy(candidates, (cand) => cand.deps.length);
  const numCandidates = sorted.length;

  checkKeyDuplicates(sorted); // TODO: not working, fix this.
  checkCyclicReference(sorted);
  checkSelfReference(sorted);

  let loopCount = 0;
  while (instanceMap.size < numCandidates) {
    const cand = sorted.pop();
    loopCount++;
    if (loopCount > numCandidates * (numCandidates - 1)) {
      throw new CyclicReferenceError(`cyclic reference found: ${cand.key}`);
    }
    const depInsts = cand.deps.map((name: string) => instanceMap.get(name));
    if (reject(depInsts).length > 0) {
      sorted.unshift(cand);
      continue;
    }
    const instance = await cand.instantiator.apply(this, depInsts);
    instanceMap.set(cand.key, instance);
  }
};

export const resolve = <T>(key: string): T => {
  return instanceMap.get(key);
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
  const duplicated = duplicatedKeys(arr);
  if (duplicated.length > 0) {
    throw new DuplicateModuleKeyError(`duplicated key found: ${duplicated[0]}`);
  }
};

const duplicatedKeys = (arr: Candidate[]) =>
  difference(
    uniq(arr.map((elem) => elem.key)),
    arr.map((elem) => elem.key));

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