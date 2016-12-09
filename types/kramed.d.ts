interface IKramedRenderer {
  link: any;
  math: any;
}

interface IKramedRendererConstructable {
  new(): IKramedRenderer;
}

interface IKramedCallOptions {
  renderer: IKramedRenderer;
}

interface IKramed {
  (str: string, options: IKramedCallOptions): string;
  Renderer: IKramedRendererConstructable;
  setOptions(options: any): void;
}

declare var kramed: IKramed;
declare module 'kramed' {
  export = kramed;
}
