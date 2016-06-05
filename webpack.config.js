/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: '#cheap-module-eval-source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'dist/'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            }
        ]
    },
    postcss: {
        defaults: [
            require('precss'),
            require('postcss-bem')({
                defaultNamespace: 'b', // default namespace to use, none by default
                style: 'bem', // suit or bem, suit by default,
                separators: {
                    namespace: '-',
                    descendent: '__',
                    modifier: '_'
                }
            }),
            require('postcss-import')({ glob: true }),
            require('postcss-simple-vars'),
            require('postcss-mixins'),
            require('postcss-color-function')(),
            require('postcss-nested'),
            require('postcss-cssnext')
        ]
    },
    eslint: {
        configFile: '.eslintrc'
    }
};
