declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production';
    E2E: string;
  };
};

interface Window {
  _paq?: unknown[][];
}
