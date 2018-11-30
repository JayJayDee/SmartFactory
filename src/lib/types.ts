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

export type ContainerOptions = {
  debug?: boolean;
  includes?: string[];
  excludes?: string[];
};

export type ContainerLogger = {
  info: (payload: any) => void;
  debug: (payload: any) => void;
}