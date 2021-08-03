const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry : "./src/client/js/main.js",
    mode : "development",
    watch : false, //에러 때문에 임시로 false 사용. 자동갱신을 위해서는 true 사용 
    plugins: [new MiniCssExtractPlugin({
        filename : "css/styles.css",
    })],
    output : {
        filename : "js/main.js",
        path : path.resolve(__dirname, "assets"),
        clean : true,
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