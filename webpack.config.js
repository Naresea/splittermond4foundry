const path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'splittermond.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
