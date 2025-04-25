/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        domains: ['img.freepik.com'], // ✅ External image host support
    },
    webpack: (config) => {
        // ✅ Add polyfills for browser use
        config.resolve.fallback = {
            ...config.resolve.fallback,
            process: require.resolve('process/browser'),
            buffer: require.resolve('buffer/'),
        };

        config.plugins.push(
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            })
        );

        return config;
    },
};

module.exports = nextConfig;
