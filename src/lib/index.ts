import resolveModule from './module-resolver';

export { resolve, injectable, ready } from './container';

resolveModule('**/*.ts');