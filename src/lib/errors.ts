export class CyclicReferenceError extends Error {
  constructor(msg: any) {
    super(msg);
  }
}
export class SelfReferenceError extends Error {
  constructor(msg: any) {
    super(msg);
  }
}