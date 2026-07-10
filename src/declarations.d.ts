declare module '*.css' {
  const content: string;
  export default content;
}

// Matomo's global command queue, injected by its tracking snippet.
interface Window {
  _paq?: unknown[][];
}
