import {  includes, some, uniq, filter } from 'lodash';
import { Candidate } from './types';
import { CyclicReferenceError, SelfReferenceError, DuplicateModuleKeyError } from './errors';

export const checkCyclicReference = (arr: Candidate[]) => {
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