declare module '*.css' {
  const content: string;
  export default content;
}

// Image imports resolve to the bundled asset's URL (rspack's `asset/resource`),
// which is what an <img src> wants.
declare module '*.svg' {
  const src: string;
  export default src;
}

// The two build-time flags rspack inlines into the client bundle (DefinePlugin).
// Declared narrowly rather than pulling in @types/node, which would also make
// every other Node global look available in browser code.
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production';
    E2E: string;
  };
};

// Matomo's global command queue, injected by its tracking snippet.
interface Window {
  _paq?: unknown[][];
}
