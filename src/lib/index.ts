import { sortBy, reject, includes } from 'lodash';

type Instantiator = (...args: any[]) => Promise<any>;
// type DependancyNode = {[key: string]: DependancyNode | string[]};

type Candidate = {
  key: string;
  deps: string[];
  instantiator: Instantiator;
};

const candidates: Candidate[] = [];
const instanceMap = new Map<string, any>();

export const bean = async (key: string,deps: string[], instantiator: Instantiator) => {
  candidates.push({ key, deps, instantiator });
};

export const ready = async () => {
  const sorted = sortBy(candidates, (cand) => cand.deps.length);
  const numCandidates = sorted.length;
  
  // TODO: cyclic referencing detection routine.
  

  while (instanceMap.size < numCandidates) {
    const cand = sorted.pop();
    const depInsts = cand.deps.map((name: string) => instanceMap.get(name));
    if (reject(depInsts).length > 0) {
      sorted.unshift(cand);
      continue;
    }
    const instance = await cand.instantiator.apply(this, depInsts);
    instanceMap.set(cand.key, instance);
  }
  console.log(instanceMap);
};

export const resolve = <T>(key: string): T => {
  return instanceMap.get(key);
};

const crossReference = (a: Candidate, b: Candidate): boolean =>
  includes(a.deps, b.key) && includes(b.deps, a.key);

const subset = (a: any[]): any[][] => {
  return [];
}