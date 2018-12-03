import { sortBy, reject } from 'lodash';
import { DependancyNotfoundError } from './errors';
import { Candidate, Instantiator, Injectable, ContainerOptions, ContainerLogger } from './types';
import { checkKeyDuplicates, checkCyclicReference, checkSelfReference } from './container-helpers';

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
  logger: ContainerLogger,
  candidates: Candidate[],
  instances: Map<string, any>) =>
    async () => {
      const sorted = sortBy(candidates, (cand) => cand.deps.length);
      const numCandidates = sorted.length;
      logger.debug(`* injection candidates:`);
      logger.debug(sorted);

      try {
        checkKeyDuplicates(sorted);
        checkCyclicReference(sorted);
        checkSelfReference(sorted);
      } catch (err) {
        throw err;
      }

      let loopCount = 0;
      while (instances.size < numCandidates) {
        const cand = sorted.pop();
        loopCount++;
        if (loopCount > (numCandidates + 1) * numCandidates) {
          throw new DependancyNotfoundError(`dependancy not found: ${cand.key}`);
        }
        const depInsts = cand.deps.map((name: string) => instances.get(name));
        if (reject(depInsts).length > 0) {
          sorted.unshift(cand);
          continue;
        }
        const instance = await cand.instantiator.apply(this, depInsts);
        instances.set(cand.key, instance);
      }
      logger.debug(`* modules in container`);
      logger.debug(instances);
    };

// module from container resolver function factory.
export const resolveFunc = (
  srcOpts: ContainerOptions,
  instances: Map<string, any>) =>
    <T> (key: string): T => {
      return instances.get(key);
    };