import { sortBy } from 'lodash';
import { EmptyDependencyError } from './errors';
import { Candidate, Instantiator, Injectable, ContainerOptions, ContainerLogger } from './types';
import { checkKeyDuplicates, checkCyclicReference, checkSelfReference } from './container-helpers';

type GraphNode = {
  key: string;
  to: string[];
  from: string[];
};

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

      const sorted = sortBy(candidates, (cand) => cand.deps.length * -1);
      // const numCandidates = sorted.length;
      logger.debug(`* injection candidates:`);
      logger.debug(sorted);

      try {
        checkKeyDuplicates(sorted);
        checkCyclicReference(sorted);
        checkSelfReference(sorted);
      } catch (err) {
        throw err;
      }
      const nodes = graphNodes(sorted);
      logger.debug('* dependency graph');
      logger.debug(nodes);

      subgraphs(nodes);

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

// generate dependency graph nodes
const graphNodes = (cands: Candidate[]): GraphNode[] => {
  const nodeMap = new Map<string, GraphNode>();
  cands.map((cand) => nodeMap.set(cand.key, {
    key: cand.key,
    to: cand.deps,
    from: []
  }));
  cands.map((cand) => 
    cand.deps.map((to) =>
      nodeMap.get(to).from.push(cand.key)));
  return Array.from(nodeMap.keys()).map((key) =>nodeMap.get(key));
};

// create subgraphs from graph nodes
const subgraphs = (nodes: GraphNode[]) => {
  const map = new Map<string, GraphNode>();
  const visit = new Map<string, boolean>();
  const stack: string[] = [];

  nodes.map((n) => map.set(n.key, n));
  nodes.map((n) => visit.set(n.key, false));
  stack.push(nodes[0].key);

  while(stack.length > 0) {
    const n = stack.pop();
    const node = map.get(n);
    visit.set(n, true);
    node.to.map((to) => 
      visit.get(to) === false ?
        stack.push(to) : null);
    node.from.map((to) => 
      visit.get(to) === false ?
        stack.push(to) : null);
    console.log('------');
    console.log(node);
  }
  console.log(visit);
};