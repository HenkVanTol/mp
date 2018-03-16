const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-theme-vars.less'), 'utf8'));

module.exports = {
    entry: './client/index.js',
    // output: {
    //   path: '/',
    //   filename: 'bundle.js'
    // },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                test: /\.js$/,
                options: {
                    presets: [
                        ['env', { modules: false, targets: { browsers: ['last 2 versions'] } }],
                        'react'
                    ],
                    cacheDirectory: true,
                    plugins: [
                        ['import', { libraryName: "antd", style: true }],
                        'transform-strict-mode',
                        'transform-object-rest-spread'
                    ]
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /dist/
            },
            {
                test: /\.gif$/,
                use: 'file-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            modifyVars: themeVariables,
                            root: path.resolve(__dirname, './'),
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'client/index.html'
        }),
        new WriteFilePlugin()
    ]
};