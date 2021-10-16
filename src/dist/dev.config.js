"use strict";
exports.__esModule = true;
exports.getDevConfig = void 0;
/**
 * @description webpack 开发配置
 * @author nikangdi
 * @date 2021-03-08
 */
var utils_1 = require("./utils");
var webpack_merge_1 = require("webpack-merge");
var base_config_1 = require("./base.config");
function getDevConfig(options, extra) {
    if (extra === void 0) { extra = {}; }
    var isLocal = process.env.LOCAL === "true"; // 可能有的情景还需要加以区分local和dev
    return webpack_merge_1["default"](base_config_1.getBaseConfig(options), {
        mode: "development",
        resolve: {
            alias: {
                "react-dom": "@hot-loader/react-dom"
                // 在构建react项目时，默认使用的webpack-dev-serve有热刷新功能，
                // 但是局限是修改一处会使整个页面刷新,当引入了react-hot-loader时，可以实现局部刷新，
                // 即同个页面上，某一处的数据修改不会让整个页面一起刷新
                // 在react16.6+以后，推荐使用兼容性更好的 @hot-loader/react-dom 来代替react-dom
                // 因此需要本alias, 但我理解这个更应该在业务项目中做处理
            }
        },
        module: {
            rules: [
                {
                    test: /.s?css$/,
                    use: ['css-hot-loader', 'style-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        devServer: {
            port: 9000,
            open: true,
            historyApiFallback: true,
            // devServer.historyApiFallback的意思是当路径匹配的文件不存在时不出现404,
            // 而是取配置的选项historyApiFallback.index对应的文件
            inline: true,
            hot: true,
            contentBase: utils_1.Root('dist'),
            host: '0.0.0.0'
        }
    });
}
exports.getDevConfig = getDevConfig;
