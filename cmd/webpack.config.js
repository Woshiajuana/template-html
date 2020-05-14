
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 遍历目录结构
const { entry, expand } = ((dirPath, cut = '') => {
    let entry = {}, expand = {};
    let loop;
    (loop = (dir) => {
        fs.readdirSync(dir).forEach((file) => {
            let filePath = path.join(dir, '/' + file);
            let fileStat = fs.statSync(filePath);
            if (fileStat.isFile() && file === 'index.js') {
                let fileDirArr = filePath.substring(filePath.indexOf(cut) + cut.length + 1).replace(/\\/g, '/').split('\/');
                fileDirArr = unique(fileDirArr);
                let key = fileDirArr.join('_');
                entry[key] = filePath;
                try {
                    expand[key] = require(filePath.replace('index.js', 'expand.js'));
                } catch (e) {
                    expand[key] = {};
                }
            } else if (fileStat.isDirectory()) {
                loop(filePath);
            }
        });
    })(dirPath);
    return { entry, expand };
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
        filename: 'assets/js/[name].[hash].js',
        // filename: 'assets/js/[name].js',
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
                // test: /\.html$/,
                // loader: 'html-loader',
                // exclude: /node_modules/,
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
            // 处理图片
            {
                test: /\.(png|jpeg|jpg|gif|svg)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: urlLoader,
                    },
                    {
                        loader: './cmd/assist.url.loader.js',
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
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            },
            {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            },
            {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm|mp4)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'videos/[name].[ext]?[hash:8]',
                        outputPath: 'assets/',
                        publicPath: '',
                    },
                }],
            },
        ]
    },
    // 插件
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            // (the commons chunk name)
            filename: "assets/js/commons.[hash].js",
            // (the filename of the commons chunk)
            // minChunks: 3,
            // (Modules must be shared between 3 entries)
            // chunks: ["pageA", "pageB"],
            // (Only use these entries)
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true,
            }
        }),
        new ExtractTextPlugin({
            // name: "commons",
            filename: 'assets/css/[name].[chunkhash].css',
            // filename: 'assets/css/[name].css',
            // chunkFilename: "[id].css"
            allChunks: true,
            // chunks: ["pageA", "pageB"],
        }),
    ],
};

for (let key in entry) {
    const htmlPlugin = new HtmlWebpackPlugin({
        ...expand[key],
        filename: `${key}.html`,
        template: entry[key].replace('index.js', 'index.html'),
        minify: {
            removeAttributeQuotes: false, // 移除属性的引号
            removeComments: true, // 移除注释
            collapseWhitespace:true, // 折叠空白区域
        },
        chunks: ['commons', key],
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

