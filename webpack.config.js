const path = require('path')

module.exports = {
    entry: './js/main.js',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    watch: true,
    watchOptions: {
        ignored: ['node_modules'],
    }
};