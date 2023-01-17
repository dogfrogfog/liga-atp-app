/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
});
const removeImports = require('next-remove-imports')({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
});

module.exports = removeImports(
  withPWA({
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['upload.wikimedia.org'],
    },
  })
);
