import { crossReference, subsets, selfReference } from '../src/lib/container-helpers';
import { Candidate } from '../src/lib/types';

describe('crossReference() tests', () =>{
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
});

describe('subsets() tests', () => {
  test('each length of results of subsets() function must be same as paremter n', () => {
    const arr = ['a', 'b', 'c', 'd'];
    subsets(arr, 3).map((elem) => expect(elem.length).toBe(3));
    subsets(arr, 2).map((elem) => expect(elem.length).toBe(2));
  });
});

describe('selfReference() tests', () => {
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
});