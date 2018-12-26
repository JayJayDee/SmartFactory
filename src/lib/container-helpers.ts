import { includes, some, uniq, filter } from 'lodash';
import { Candidate } from './types';
import { SelfReferenceError, DuplicateModuleKeyError, CyclicReferenceError, DependancyNotfoundError } from './errors';

export const checkCyclicReference = (arr: Candidate[]) => {
  arr.map((c) => {
    checkNodeCycle(arr, c.key);
  });
};

export const checkNodeCycle = (arr: Candidate[], start: string) => {
  const map = new Map<string, Candidate>();
  const stack = [ start ];
  arr.map((c) => map.set(c.key, c));

  while (stack.length > 0) {
    const node = map.get(stack.pop());
    node.deps.map((d) => {
      if (d === start) throw new CyclicReferenceError(`cyclic reference found: ${d}`);
      stack.push(d);
    });
  }
};

export const checkDepNotfound = (arr: Candidate[]) => {
  const keys = arr.map((c) => c.key);
  arr.map((c) => c.deps.map((d) => {
    if (includes(keys, d) === false) throw new DependancyNotfoundError(`dependency not found: ${d}`);
  }));
};

export const checkSelfReference = (arr: Candidate[]) => {
  let moduleName = null;
  const selfs = arr.map((elem) => {
    const selfRef = selfReference(elem);
    if (selfRef === true) moduleName = elem.key;
    return selfRef;
  });
  if (some(selfs)) throw new SelfReferenceError(`self reference found: ${moduleName}`);
};

export const checkKeyDuplicates = (arr: Candidate[]) => {
  const duplciates = duplicateKeys(arr);
  if (duplciates.length > 0) {
    throw new DuplicateModuleKeyError(`duplicated key found: ${duplciates[0]}`);
  }
};

export const duplicateKeys = (arr: Candidate[]): string[] =>
  uniq(arr.map((elem) => elem.key)).map((key: string) =>
    filter(arr, (elem) => elem.key === key).length === 1 ? null : key)
    .filter((elem) => (elem));

export const selfReference = (a: Candidate) =>
  includes(a.deps, a.key);

export const crossReference = (a: Candidate, b: Candidate): boolean =>
  includes(a.deps, b.key) && includes(b.deps, a.key);

export const subsets = (arr: any[], n: number): any[][] =>
  arr
  .reduce(
    (subsets, value) => subsets.concat(
      subsets.map((set: any) => [value,...set])
    ), [[]]
  ).filter((subset: any[]) => subset.length === n);