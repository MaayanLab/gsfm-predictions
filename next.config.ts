import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkGfm from "remark-gfm";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: (config, {  }) => {
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.fallback = { fs: false };
    config.plugins.push(
      new NodePolyfillPlugin(), 
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
            to: 'static/chunks/pages',
          },             {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs',
            to: 'static/chunks/pages',
          },
          {
            from: './model/onnx',
            to: 'static/chunks/pages',
          },
        ],
      }),
    );

    return config;
  } 
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
