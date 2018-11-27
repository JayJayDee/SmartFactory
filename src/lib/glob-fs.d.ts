
declare function GlobFs(opts: any): GlobFs.GlobObject;
declare namespace GlobFs {
  export type GlobObject = {
    readFileSync: (path: string) => string[];
  };
}
declare module 'glob-fs' {
  export = GlobFs;
}