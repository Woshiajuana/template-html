

const config = require('./config');
const walk = require('./walk.util');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let {
    entryDirName,
    output,
    resolve,
    extractTextPlugin,
} = config;

// 遍历目录结构
const entry = walk.run(entryDirName, 'views');

const urlLoader = {
    limit: '1024',
    outputPath: 'assets/',
    publicPath: '../',
    name: 'images/[name].[ext]'
};

let webpackConfig = {
    entry,
    output,
    resolve,
    module: {
        rules: [
            // 处理 html 文件
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            // 处理 css 文件
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
            },
            // 处理 scss 文件
            {
                test: /.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: "sass-loader"
                    }],
                })
            },
            // 处理 js 文件
            {
                test: /\.js(\?[^?]+)?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
            },
            // 处理url文件
            {
                test: /\.(png|jpeg|jpg|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: urlLoader,
                    },
                    {
                        loader: './build/assist.url.loader.js',
                        options: {
                            urlLoader,
                            html: {
                                publicPath: '',
                            },
                            css: {
                                publicPath: '../',
                            },
                        }
                    },
                ],
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true,
            }
        }),
        new ExtractTextPlugin(extractTextPlugin),
    ],
};
for (let key in entry) {
    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `${key}.html`,
        template: entry[key].replace('index.js', 'index.html'),
        minify: { removeAttributeQuotes: false },
        chunks: [key],
        inject: 'body',
    });
    webpackConfig.plugins.push(htmlPlugin);
}


module.exports = webpackConfig;
