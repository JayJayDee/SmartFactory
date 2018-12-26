import { find, includes } from 'lodash';
import { ContainerLogger, Candidate } from './types';

type GraphNode = {
  key: string;
  to: string[];
  from: string[];
  instantiator: (...args: any[]) => Promise<any>;
};

// instantiator factory.
const instantiator = (
  logger: ContainerLogger,
  instances: Map<string, any>) =>
    async (candidates: Candidate[]) => {
      const baseTime = Date.now();
      logger.debug('* instantiating..');

      const graph = graphize(candidates);
      const map = new Map<string, GraphNode>();
      graph.map((n) => map.set(n.key, n));

      const queue: string[] = [ graph[0].key ];
      while (queue.length > 0) {
        const node = map.get(queue.pop());
        let ready = true;

        for (let i = 0; i < node.to.length; i++) {
          const key = node.to[i];
          const dep = instances.get(key);

          if (!dep) {
            pushNoDuplicate(queue, key);
            ready = false;
          }
        }

        if (ready === true) {
          const deps = node.to.map((d) => instances.get(d));
          const instance: any =
            await node.instantiator.apply(this, deps);
          const elapsed = Date.now() - baseTime;
          instances.set(node.key, instance);
          logger.debug(`* dependency resolved: ${node.key}, elapsed time: ${elapsed} ms`);
        }
        node.from.map((d) => {
          if (!instances.get(d)) pushNoDuplicate(queue, d);
        });
      }
    };
export default instantiator;

export const pushNoDuplicate = (queue: string[], elem: string) =>
  includes(queue, elem) ? null : queue.push(elem)

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