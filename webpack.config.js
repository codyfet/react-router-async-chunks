const HtmlWebpackPlugin = require('html-webpack-plugin');
var AsyncChunkNames = require('webpack-async-chunk-names-plugin');

var htmlPlugin = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

var asyncChunkNames = new AsyncChunkNames();

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                /**
                 * Отключим дефолтные настройки.
                 */
                default: false,
                vendors: false,
                /**
                 * Настраиваем вендор чанк.
                 */
                vendor: {
                    // Имя вендор чанка.
                    name: 'vendor',
                    // Включить в вендор чанк синхронные и всинхронные модули.
                    chunks: 'all',
                    // Включить в вендор чанк модули из node_modules.
                    test: /node_modules/
                },
                common: {
                    name: 'common',
                    minChunks: 2,
                    chunks: 'async',
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss']
    },
    plugins: [htmlPlugin, asyncChunkNames]
};