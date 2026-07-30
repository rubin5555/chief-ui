import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  mode: isDev ? 'development' : 'production',
  entry: { main: './src/index.tsx' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // No content hash in development. A hot update asks the server for the asset
    // name the running page was built with, and a content hash changes with the
    // very edit that triggered the update — so the request 404s, historyApiFallback
    // answers it with index.html, and the client dies on a stylesheet whose MIME
    // type is text/html. The failed chunk aborts the whole update, which is why
    // every edit needed a manual reload.
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    cssFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[contenthash:8].js',
    cssChunkFilename: isDev ? '[name].chunk.css' : '[name].[contenthash:8].css',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: { syntax: 'typescript', tsx: true },
            transform: {
              react: {
                runtime: 'automatic',
                development: isDev,
                refresh: isDev,
              },
              reactCompiler: true,
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        type: 'css/auto',
      },
      // Images resolve to a URL instead of being inlined, so the document
      // letterhead's emblem is cached on its own rather than riding along in the
      // JS bundle. They live in src and go through the bundler because `public/`
      // holds only the HTML template — nothing copies it into the build.
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // Inlined so the client can tell it is under test. Only the router devtools
    // read it — see src/routes/__root.tsx.
    new rspack.DefinePlugin({
      'process.env.E2E': JSON.stringify(process.env.E2E ?? ''),
    }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
    // No HotModuleReplacementPlugin here: `devServer.hot` applies it already, and
    // registering it twice is what the dev server warns about on every start.
    ...(isDev ? [new ReactRefreshRspackPlugin()] : []),
    new TsCheckerRspackPlugin({
      typescript: { tsgo: true },
    }),
  ],
  devServer: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    hot: true,
    historyApiFallback: true,
  },
  lazyCompilation: false,
});
