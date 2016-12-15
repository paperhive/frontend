interface IMap {
  original: number;
  transformed: number;
}

type IMapping = IMap[];

interface IRange {
  position: number;
  length: number;
}

declare module 'srch' {
  export function backTransformRange(positions: number[], mapping: IMapping): number[];
  export class SearchIndex {
    constructor(str: string);
    search(str: string): IRange[];
  }
}
