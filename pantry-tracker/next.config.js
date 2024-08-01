/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/utils/image-loader.js',
    domains: ['png.pngtree.com'],
  },
}

module.exports = nextConfig