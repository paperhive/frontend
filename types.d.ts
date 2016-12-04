/// <reference types="pdf" />

declare module 'pdfjs-dist' {
  export interface IPDFRenderTextParameters {
    container: HTMLElement;
    enhanceTextSelection?: boolean;
    textContent: TextContent;
    textDivs?: HTMLElement[];
    timeout?: number;
    viewport: PDFPageViewport;
  }

  interface IPDFRenderTextTask extends PDFRenderTask {
    expandTextDivs(expandDivs: boolean): void;
  }

  export interface IPDFAnnotationLayerParameters {
    viewport: PDFPageViewport;
    div: HTMLElement;
    annotations: PDFAnnotations;
    page: PDFPageProxy;
    linkService?: any; // TODO
    imageResourcesPath?: string;
    renderInteractiveForms?: boolean;
  }

  export interface IPDFAnnotationLayer {
    render(params: IPDFAnnotationLayerParameters): void;
    update(params: IPDFAnnotationLayerParameters): void;
  }

  export interface IPDFJS extends PDFJSStatic {
    AnnotationLayer: IPDFAnnotationLayer;
    renderTextLayer(params: IPDFRenderTextParameters): IPDFRenderTextParameters;
  }

  export var PDFJS: IPDFJS;
}
