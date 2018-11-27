export class Injectable<T> {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  public getName() {
    return this.name;
  }
}

export type Instantiator = (...args: any[]) => Promise<any>;

export type Candidate = {
  key: string;
  deps: string[];
  instantiator: Instantiator;
};