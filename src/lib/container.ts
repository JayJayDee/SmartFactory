import { EmptyDependencyError } from './errors';
import { Candidate, Instantiator, Injectable, ContainerOptions, ContainerLogger } from './types';
import { checkKeyDuplicates, checkCyclicReference, checkSelfReference } from './container-helpers';
import instantiator from './instantiator';

// container module-registerer factory.
export const injectableFunc = (
  srcOpts: ContainerOptions,
  candidates: Candidate[]) =>
    async <T>(key: string, deps: string[], instantiator: Instantiator, multiInstance?: boolean) => {
      let multi = false;
      if (multiInstance === true) multi = true;
      
      candidates.push({ key, deps, instantiator, multi });
      return new Injectable<T>(key);
    };

// container ready awaiting function factory.
export const readyFunc = (
  srcOpts: ContainerOptions,
  logger: ContainerLogger,
  candidates: Candidate[],
  instances: Map<string, any>) =>
    async () => {
      if (candidates.length === 0) {
        throw new EmptyDependencyError('at least one dependency required.');
      }
      logger.debug(`* injection candidates:`);
      logger.debug(candidates);

      try {
        checkKeyDuplicates(candidates);
        checkCyclicReference(candidates);
        checkSelfReference(candidates);
      } catch (err) {
        throw err;
      }

      const instantiate = instantiator(logger, instances);
      await instantiate(candidates);

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
