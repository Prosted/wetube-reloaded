const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_URL = "./src/client/js/"

module.exports = {
    entry : {
        main : BASE_URL+"main.js",
        videoPlayer : BASE_URL+"videoPlayer.js",
        recorder : BASE_URL+"recorder.js",
        commentSection : BASE_URL+"commentSection.js",
    },
    mode : "development",
    watch : false, //에러 때문에 임시로 false 사용. 자동갱신을 위해서는 true 사용 
    plugins: [new MiniCssExtractPlugin({
        filename : "css/styles.css",
    })],
    output : {
        filename : "js/[name].js",
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