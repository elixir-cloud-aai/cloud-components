/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");

const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    name: "root",
    entry: {
        main: path.resolve(appDir, "index.tsx"),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        plugins: [
            new ResolveTypeScriptPlugin()
        ],
    },
    output: {
        path: outDir,
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/, // Add .jsx and .tsx
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ],
                    },
                },
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Welcome to FAST!",
            template: path.resolve(appDir, "index.html"),
        }),
    ],
};
