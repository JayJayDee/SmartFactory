import { Candidate, ContainerLogger } from "../src/lib/types";
import { injectableFunc, readyFunc } from '../src/lib/container';
import { CyclicReferenceError, DuplicateModuleKeyError, SelfReferenceError } from "../src/lib/errors";

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

  test('if ready() function works normally, instanceMap must have one candidate', () => {
    const candidates: Candidate[] = [
      { key: 'test', deps: [], instantiator: async () => 3 }
    ];
    const instanceMap = new Map<string, any>();
    const ready = readyFunc(null, dummyLogger, candidates, instanceMap);
    ready().then(() => {
      expect(instanceMap.size).toBe(1);
      expect(instanceMap.get('test')).toBe(3);
    });
  });

  test('if there is cyclic-reference, must be throw error when ready()', () => {
    const candidates: Candidate[] = [
      { key: 'A', deps: ['B'], instantiator: async () => 1 },
      { key: 'B', deps: ['A'], instantiator: async () => 2 }
    ];
    const instanceMap = new Map<string, any>();
    const ready = readyFunc(null, dummyLogger, candidates, instanceMap);
    expect(ready()).rejects.toBeInstanceOf(CyclicReferenceError);
  });

  test('if there are duplicated candidates, must be throw error when ready()', () => {
    const candidates: Candidate[] = [
      { key: 'A', deps: [], instantiator: async () => 1 },
      { key: 'A', deps: [], instantiator: async () => 2 }
    ];
    const instanceMap = new Map<string, any>();
    const ready = readyFunc(null, dummyLogger, candidates, instanceMap);
    expect(ready()).rejects.toBeInstanceOf(DuplicateModuleKeyError);
  });

  test('if there is self-reference, must be throw error when ready()', () => {
    const candidates: Candidate[] = [
      { key: 'A', deps: ['A'], instantiator: async () => 1 }
    ];
    const instanceMap = new Map<string, any>();
    const ready = readyFunc(null, dummyLogger, candidates, instanceMap);
    expect(ready()).rejects.toBeInstanceOf(SelfReferenceError);
  });
});