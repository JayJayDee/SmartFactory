import { crossReference, subsets, selfReference, duplicateKeys, checkCyclicReference, checkSelfReference, checkKeyDuplicates } from '../src/lib/container-helpers';
import { Candidate } from '../src/lib/types';
import { CyclicReferenceError, SelfReferenceError, DuplicateModuleKeyError } from '../src/lib/errors';

describe('crossReference tests', () => {
  test('if there is cross-reference between two candidates, the function must be returns true', () => {
    const a: Candidate = {
      key: 'A',
      deps: ['B'],
      instantiator: async () => null
    };
    const b: Candidate = {
      key: 'B',
      deps: ['A'],
      instantiator: async () => null
    };
    expect(crossReference(a, b)).toBe(true);
  });

  test('if there is no cross-reference between two candidates, the function must be returns false', () => {
    const a: Candidate = {
      key: 'A',
      deps: ['B'],
      instantiator: async () => null
    };
    const b: Candidate = {
      key: 'B',
      deps: [],
      instantiator: async () => null
    };
    expect(crossReference(a, b)).toBe(false);
  });

  test('if there is cross-reference, checkCrossReference() must be throw error', () => {
    const arr: Candidate[] = [
      { key: 'A', deps: ['B'], instantiator: async () => null },
      { key: 'B', deps: ['A'], instantiator: async () => null },
      { key: 'C', deps: ['A'], instantiator: async () => null },
    ];
    expect(() => {
      checkCyclicReference(arr);
    }).toThrow(CyclicReferenceError);
  });
});

describe('subsets tests', () => {
  test('each length of results of subsets() function must be same as paremter n', () => {
    const arr = ['a', 'b', 'c', 'd'];
    subsets(arr, 3).map((elem) => expect(elem.length).toBe(3));
    subsets(arr, 2).map((elem) => expect(elem.length).toBe(2));
  });
});

describe('selfReference tests', () => {
  test('if a candidate has a self-reference, the function must returns true', () => {
    const a: Candidate = {
      key: 'A',
      deps: ['A', 'B'],
      instantiator: async () => null
    };
    expect(selfReference(a)).toBe(true);
  });

  test('if a candidate has no self-reference, the function must returns false', () => {
    const a: Candidate = {
      key: 'A',
      deps: ['B', 'C'],
      instantiator: async () => null
    };
    expect(selfReference(a)).toBe(false);
  });

  test('if there is self-reference, checkSelfReference() must be throw error', () => {
    const arr: Candidate[] = [
      { key: 'A', deps: ['A'], instantiator: async () => null },
      { key: 'C', deps: ['A'], instantiator: async () => null },
    ];
    expect(() => {
      checkSelfReference(arr);
    }).toThrow(SelfReferenceError);
  });
});

describe('duplicatedKeys tests', () => {
  test('if duplicated keys in cadidates, the function must returns duplicated only', () => {
    const candidates: Candidate[] = [
      { key: 'A', deps: [], instantiator: async () => null },
      { key: 'B', deps: [], instantiator: async () => null },
      { key: 'A', deps: [], instantiator: async () => null }
    ];
    const duplicates = duplicateKeys(candidates);
    expect(duplicates.length).toBe(1);
    expect(duplicates[0]).toEqual('A');
  });

  test('if duplicated keys in cadidates, checkKeyDuplicates() must be throw error', () => {
    const candidates: Candidate[] = [
      { key: 'A', deps: [], instantiator: async () => null },
      { key: 'B', deps: [], instantiator: async () => null },
      { key: 'A', deps: [], instantiator: async () => null }
    ];
    expect(() => {
      checkKeyDuplicates(candidates);
    }).toThrow(DuplicateModuleKeyError);
  });
});

