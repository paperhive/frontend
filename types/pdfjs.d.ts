// Type definitions for PDF.js
// Project: https://github.com/mozilla/pdf.js
// Definitions by: Josh Baldwin <https://github.com/jbaldwin/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*
Copyright (c) 2013 Josh Baldwin https://github.com/jbaldwin/pdf.d.ts

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// tslint:disable:interface-name

interface PDFPromise<T> {
  isResolved(): boolean;
  isRejected(): boolean;
  resolve(value: T): void;
  reject(reason: string): void;
  then<U>(onResolve: (promise: T) => U, onReject?: (reason: string) => void): PDFPromise<U>;
}

interface PDFTreeNode {
  title: string;
  bold: boolean;
  italic: boolean;
  color: number[]; // [r,g,b]
  dest: any;
  items: PDFTreeNode[];
}

interface PDFInfo {
  PDFFormatVersion: string;
  IsAcroFormPresent: boolean;
  IsXFAPresent: boolean;
  [key: string]: any;	// return type is string, typescript chokes
}

interface PDFMetadata {
  parse(): void;
  get(name: string): string;
  has(name: string): boolean;
}

interface PDFSource {
  url?: string;
  data?: Uint8Array;
  httpHeaders?: any;
  password?: string;
}

interface PDFProgressData {
  loaded: number;
  total: number;
}

interface PDFRef {
  num: number;
  gen: any; // todo
}

interface PDFDestRefName {
  name: string;
}

interface PDFDestRef extends Array<PDFRef|PDFDestRefName|number> {
  0: PDFRef;
  1: PDFDestRefName;
}

interface PDFDocumentProxy {
  numPages: number;
  fingerprint: string;
  embeddedFontsUsed(): boolean;
  getPage(pageNumber: number): PDFPromise<PDFPageProxy>;
  getDestination(dest: string): PDFPromise<PDFDestRef>;
  getDestinations(): PDFPromise<PDFDestRef[]>;
  getPageIndex(ref: PDFRef): number;
  getJavaScript(): PDFPromise<string[]>;
  getOutline(): PDFPromise<PDFTreeNode[]>;
  getMetadata(): PDFPromise<{ info: PDFInfo; metadata: PDFMetadata }>;
  isEncrypted(): PDFPromise<boolean>;
  getData(): PDFPromise<Uint8Array>;
  dataLoaded(): PDFPromise<any[]>;
  destroy(): void;
}

interface PDFPageViewportOptions {
  viewBox: any;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  dontFlip: boolean;
}

interface PDFPageViewport {
  width: number;
  height: number;
  fontScale: number;
  transforms: number[];

  clone(options: PDFPageViewportOptions): PDFPageViewport;
  convertToViewportPoint(x: number, y: number): number[]; // [x, y]
  convertToViewportRectangle(rect: number[]): number[]; // [x1, y1, x2, y2]
  convertToPdfPoint(x: number, y: number): number[]; // [x, y]
}

interface PDFAnnotationData {
  subtype: string;
  rect: number[]; // [x1, y1, x2, y2]
  annotationFlags: any; // todo
  color: number[]; // [r,g,b]
  borderWidth: number;
  hasAppearance: boolean;
}

interface PDFAnnotations {
  getData(): PDFAnnotationData;
  hasHtml(): boolean; // always false
  getHtmlElement(commonOjbs: any): HTMLElement; // throw new NotImplementedException()
  getEmptyContainer(tagName: string, rect: number[]): HTMLElement; // deprecated
  isViewable(): boolean;
  loadResources(keys: any): PDFPromise<any>;
  getOperatorList(evaluator: any): PDFPromise<any>;
  // ... todo
}

interface PDFRenderTextLayer {
  beginLayout(): void;
  endLayout(): void;
  appendText(): void;
}

interface PDFRenderImageLayer {
  beginLayout(): void;
  endLayout(): void;
  appendImage(): void;
}

interface PDFRenderParams {
  canvasContext: CanvasRenderingContext2D;
  viewport?: PDFPageViewport;
  textLayer?: PDFRenderTextLayer;
  imageLayer?: PDFRenderImageLayer;
  continueCallback?: (_continue: () => void) => void;
}

interface PDFViewerParams {
  container: HTMLElement;
  viewer?: HTMLElement;
}

interface PDFRenderTask extends PDFPromise<PDFPageProxy> {
  cancel(): void;
}

interface PDFTextContentItem {
  str: string;
  transform: number[]; // [0..5]   4=x, 5=y
  width: number;
  height: number;
  dir: string; // Left-to-right (ltr), etc
  fontName: string; // A lookup into the styles map of the owning TextContent
}

interface PDFTextContent {
  items: PDFTextContentItem[];
  styles: any;
}

interface PDFRenderTextParameters {
  container: HTMLElement;
  enhanceTextSelection?: boolean;
  textContent: PDFTextContent;
  textDivs?: HTMLElement[];
  timeout?: number;
  viewport: PDFPageViewport;
}

interface PDFRenderTextTask extends PDFRenderTask {
  expandTextDivs(expandDivs: boolean): void;
}

interface PDFAnnotationLayerParameters {
  viewport: PDFPageViewport;
  div: HTMLElement;
  annotations: PDFAnnotations;
  page: PDFPageProxy;
  linkService?: any; // TODO
  imageResourcesPath?: string;
  renderInteractiveForms?: boolean;
}

 interface PDFAnnotationLayer {
  render(params: PDFAnnotationLayerParameters): void;
  update(params: PDFAnnotationLayerParameters): void;
}

interface PDFGetAnnotationsParameters {
  intent?: 'display' | 'print';
}

interface PDFPageProxy {
  pageNumber: number;
  rotate: number;
  ref: PDFRef;
  view: number[];
  getViewport(scale: number, rotate?: number): PDFPageViewport;
  getAnnotations(params: PDFGetAnnotationsParameters?): PDFPromise<PDFAnnotations>;
  render(params: PDFRenderParams): PDFRenderTask;
  getTextContent(): PDFPromise<PDFTextContent>;
  // getOperationList(): PDFPromise<>;
  destroy(): void;
}

interface PDFObjects {
  get(objId: number, callback?: any): any;
  resolve(objId: number, data: any): any;
  isResolved(objId: number): boolean;
  hasData(objId: number): boolean;
  getData(objId: number): any;
  clear(): void;
}

interface PDFJSUtilStatic {
  normalizeRect(rect: number[]): number[];
}

interface PDFJS {
  maxImageSize: number;
  cMapUrl: string;
  cMapPacked: boolean;
  disableFontFace: boolean;
  imageResourcesPath: string;
  disableWorker: boolean;
  workerSrc: string;
  disableRange: boolean;
  disableStream: boolean;
  disableAutoFetch: boolean;
  pdfBug: boolean;
  postMessageTransfers: boolean;
  disableCreateObjectURL: boolean;
  disableWebGL: boolean;
  disableFullscreen: boolean;
  useOnlyCssZoom: boolean;
  verbosity: number;
  maxCanvasPixels: number;
  openExternalLinksInNewWindow: boolean;
  isEvalSupported: boolean;
  Util: PDFJSUtilStatic;
  AnnotationLayer: PDFAnnotationLayer;
  getDocument(
    source: string | Uint8Array | PDFSource,
    pdfDataRangeTransport?: any,
    passwordCallback?: (fn: (password: string) => void, reason: string) => string,
    progressCallback?: (progressData: PDFProgressData) => void
  ): PDFPromise<PDFDocumentProxy>;
  PDFViewer(params: PDFViewerParams): void;
  renderTextLayer(params: PDFRenderTextParameters): PDFRenderTextTask;
}

declare module 'pdfjs-dist' {
  export var PDFJS: PDFJS;
}
