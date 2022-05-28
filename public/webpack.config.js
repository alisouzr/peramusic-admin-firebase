const path = require("path");

module.exports = {
    mode: "development",
    entry: "./public/scripts/index.js",
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "public", "dist"),
    },
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devServer: {
        writeToDisk: true,
    },
};