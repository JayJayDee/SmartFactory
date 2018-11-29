import { crossReference } from '../src/lib/container-helpers';
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