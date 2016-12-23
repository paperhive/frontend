interface IMap {
  original: number;
  transformed: number;
  // TODO: parametrize this
  textObject: PDFTextContentItem;
  pageNumber: number;
}

type IMapping = IMap[];

interface IRange {
  position: number;
  length: number;
}

interface ITransformedRange {
  position: number;
  length: number;
  transformation: IMap;
}

declare module 'srch' {
  export function backTransformRange(positions: number[], mapping: IMapping): ITransformedRange[];
  export class SearchIndex {
    constructor(str: string);
    search(str: string): IRange[];
  }
}
