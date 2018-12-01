import { Candidate, ContainerLogger } from "../src/lib/types";
import { injectableFunc, readyFunc } from '../src/lib/container';

describe('injectableFunc tests', () => {
  test('after injectable() function executed, elements must be added to candidiates array', () => {
    const candidates: Candidate[] = [];
    const injectable = injectableFunc({}, candidates);
    injectable('test', [], async () => null);
    expect(candidates.length).toBe(1);
    expect(candidates[0].key).toEqual('test');
  });
});

describe('readyFunc tests', () => {
  const dummyLogger: ContainerLogger = {
    info: (payload: any) => null,
    debug: (payload: any) => null
  };

  test('after ready(), candidate key must be in instance map.', () => {
    const instanceMap = new Map<string, any>();
    const candidates: Candidate[] = [
      { key: 'test', deps: [], instantiator: async () => 1 }
    ];
    const ready = readyFunc({}, dummyLogger, candidates, instanceMap);
    ready().then(() => {
      expect(instanceMap.get('test')).not.toBeNull();
      expect(instanceMap.get('test')).toBe(1);
    });
  });
});