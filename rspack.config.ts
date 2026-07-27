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
    filename: '[name].[contenthash:8].js',
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
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
    ...(isDev ? [new ReactRefreshRspackPlugin(), new rspack.HotModuleReplacementPlugin()] : []),
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
