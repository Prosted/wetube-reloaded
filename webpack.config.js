const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry : "./src/client/js/main.js",
    mode : "development",
    plugins: [new MiniCssExtractPlugin({
        filename : "css/main.css",
    })],
    output : {
        filename : "js/main.js",
        path : path.resolve(__dirname, "assets"),
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                use : {
                    loader : "babel-loader",
                    options : {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ],
                    }
                }
            },
            {
                test : /\.scss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                  ],
            }
        ],
    }
};