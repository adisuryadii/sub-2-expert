const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: {
        index: [
            path.resolve(__dirname, 'src/scripts/index.js'),
            path.resolve(__dirname, 'src/styles/index.css'),
        ],
        favorites: [
            path.resolve(__dirname, 'src/scripts/favorites.js'),
            path.resolve(__dirname, 'src/styles/favorites.css'),
        ],
        detail: [
            path.resolve(__dirname, 'src/scripts/detail.js'),
            path.resolve(__dirname, 'src/styles/detail.css'),
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
            ],
        }, ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/templates/index.html'),
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({
            filename: 'favorites.html',
            template: path.resolve(__dirname, 'src/templates/favorites.html'),
            chunks: ['favorites'],
        }),
        new HtmlWebpackPlugin({
            filename: 'detail.html',
            template: path.resolve(__dirname, 'src/templates/detail.html'),
            chunks: ['detail'],
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/public/'),
                to: path.resolve(__dirname, 'dist/'),
                globOptions: {
                    ignore: ['**/service-worker.js'], // Ignore service-worker.js
                },
            }],
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [{
                    urlPattern: new RegExp('https://restaurant-api.dicoding.dev/'),
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'restaurant-api-cache',
                        networkTimeoutSeconds: 10,
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'image-cache',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                        },
                    },
                },
                {
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'static-resources',
                    },
                },
            ],
        }),
    ],
};