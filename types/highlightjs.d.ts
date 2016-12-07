/// <reference types="highlight.js" />

// alias highlight.js to highlightjs
// see https://github.com/s-panferov/awesome-typescript-loader/issues/249
declare module 'highlightjs' {
  export = hljs;
}
