import { find } from 'lodash';
import { ContainerLogger, Candidate } from './types';

type GraphNode = {
  key: string;
  to: string[];
  from: string[];
  instantiator: (...args: any[]) => Promise<any>;
};

type TryResult = {
  deps: string[];
  success: boolean;
};

// instantiator factory.
const instantiator = (
  logger: ContainerLogger,
  instances: Map<string, any>) => (candidates: Candidate[]) =>
    new Promise((resolve, reject) => {
      logger.debug('* instantiating..');

      const graph = graphize(candidates);
      const map = new Map<string, GraphNode>();
      const stack: string[] = [];
      graph.map((n) => map.set(n.key, n));

      const trynode = tryNode(map, instances);
    });
export default instantiator;

// generate graph
export const graphize = (candidates: Candidate[]): GraphNode[] => {
  const graph: GraphNode[] = 
    candidates.map((c) => ({
      key: c.key,
      to: c.deps,
      from: [],
      instantiator: c.instantiator
    }));
  candidates.map((c) => c.deps.map((d) => {
    find(graph, {key: d}).from.push(c.key);
  }));
  return graph;
};

export const tryNode = (
  map: Map<string, GraphNode>,
  instances: Map<string, any>) =>
    (node: GraphNode): Promise<TryResult> =>
      new Promise((resolve, reject) => {
        
      });