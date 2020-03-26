const path = require('path');

module.exports = {
    mode: 'development',
    watch: true,
    entry: './assets/js/game.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};