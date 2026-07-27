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

// Matomo's global command queue, injected by its tracking snippet.
interface Window {
  _paq?: unknown[][];
}
