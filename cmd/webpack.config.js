
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 遍历目录结构
const entry = ((dirPath, cut = '') => {
    let result = {};
    let loop;
    (loop = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            let filePath = path.join(dir, '/' + file);
            let fileStat = fs.statSync(filePath);
            if (fileStat.isFile() && file === 'index.js') {
                let fileDirArr = filePath.substring(filePath.indexOf(cut) + cut.length + 1).replace(/\\/g, '/').split('\/');
                fileDirArr = unique(fileDirArr);
                let key = fileDirArr.join('_');
                result[key] = filePath;
            } else if (fileStat.isDirectory()) {
                loop(filePath);
            }
        });
    })(dirPath);
    return result;
}) (path.join(__dirname, '../src/views'), 'views');
// urlLoader配置
const urlLoader = {
    limit: '1024',
    outputPath: 'assets/',
    publicPath: '../',
    name: 'images/[name].[ext]'
};

let webpackConfig = {
    // 入口文件
    entry,
    // 输出文件目录
    output: {
        // filename: 'assets/js/[name].[hash].js',
        filename: 'assets/js/[name].js',
        path: path.join(__dirname, '../dist')
    },
    // 替换路径配置
    resolve: {
        alias: {
            'src': path.resolve(__dirname, '../src/'),
        }
    },
    // 模块
    module: {
        rules: [
            // 处理 html 文件
            // {
            //     test: /\.html$/,
            //     loader: 'html-loader',
            //     exclude: /node_modules/,
            // },
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
    // 插件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true,
            }
        }),
        new ExtractTextPlugin({
            filename: 'assets/css/[name].css',
            // filename: 'assets/css/[name].[chunkhash].css',
        }),
    ],
};

for (let key in entry) {
    const htmlPlugin = new HtmlWebpackPlugin({
        filename: `${key}.html`,
        template: entry[key].replace('index.js', 'index.html'),
        minify: {
            removeAttributeQuotes: false,
        },
        chunks: [key],
        inject: true,
    });
    webpackConfig.plugins.push(htmlPlugin);
}

module.exports = webpackConfig;


function unique(array){
    let n = [];
    for(let i = 0; i < array.length; i++){
        if (n.indexOf(array[i]) === -1 && array[i] !== 'index.js') n.push(array[i]);
    }
    return n;
}

