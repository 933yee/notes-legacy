const path = require('path');
const webpack = require('webpack');
const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const generateFilesList = require('./prebuild_scripts/generateFilesList.js');
const isDev = (process.env.NODE_ENV === 'development');
console.log(process.env.NODE_ENV)

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./index.html",
    filename: "./index.html"
});

const runWatchMarkdownScript = {
    apply: (compiler) => {
        compiler.hooks.done.tap('RunWatchMarkdownPlugin', (stats) => {
            const runWatchMarkdownCommand = 'node ./prebuild_scripts/watchMarkdown.js';

            const childProcess = require('child_process');
            childProcess.exec(runWatchMarkdownCommand, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(stdout);
                }
            });
        });
    }
};


module.exports = {
    context: srcPath,
    resolve: {
        alias: {
            states: path.resolve(srcPath, 'states'),
            utilities: path.resolve(srcPath, 'utilities'),
            components: path.resolve(srcPath, 'components'),
            api: path.resolve(srcPath, 'api'),
            settings: path.resolve(srcPath, 'settings')
        }
    },
    entry: {
        index: './index.jsx'
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js',
        publicPath: (isDev ? '/' : './')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env', {
                                        modules: false
                                    }
                                ],
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread'
                            ]
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: [htmlPlugin, isDev && runWatchMarkdownScript],
    devServer: {
        contentBase: distPath,
        compress: true,
        port: 7070,
        historyApiFallback: true,
        before: () => {
            generateFilesList();
        }
    },
    performance: {
        hints: false,
    },
    // stats: 'none',
    devtool: 'cheap-source-map'
};

