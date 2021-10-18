/**
 * @description webpack 开发配置
 * @author nikangdi
 * @date 2021-03-08
 */
import { Root } from './utils';
import merge from "webpack-merge";
import * as webpack from "webpack";
import * as HtmlPlugin from 'html-webpack-plugin';
import * as betterProgress from 'better-webpack-progress';
import * as FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { getBaseConfig, ConfigOptions, Configuration } from "./base.config";

export function getDevConfig(options: ConfigOptions, extra: Configuration = {}) {
  const isLocal = process.env.LOCAL === "true";// 可能有的情景还需要加以区分local和dev

  const getIPAddress = () => {
    const interfaces = require('os').networkInterfaces();
    for (const devName in interfaces) {
      for (const alias of interfaces[devName]) {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return '';
  };
  
  const PORT = options?.devPort || 9000;
  const IP = getIPAddress();

  return merge(
    getBaseConfig(options),

    {
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
            use: ['css-hot-loader', 'style-loader', 'css-loader', 'sass-loader'],
            /**
             * style-loader——将处理结束的CSS代码存储在js中，运行时嵌入<style>后挂载至html页面上
             * css-loader——加载器，使webpack可以识别css模块
             * sass-loader——加载器，使webpack可以识别scss/sass文件，默认使用node-sass进行编译
             * 
             * css-hot-loader 在大多数情况下，我们可以通过style-loader实现CSS热重载。
             * 但是样式加载器需要将样式标签注入文档中，在js就绪之前，网页将没有任何样式
             * 使用webpack4 时存在问题。请使用mini-css-extract-plugin替换extract-text-webpack-plugin。
             */
          },
          {
            test: /.less$/,
            use: ['css-hot-loader', 'style-loader', 'css-loader', 'less-loader'],
          },
        ]
      },

      devServer: {
        port: PORT,
        open: true,
        quiet: true,
        historyApiFallback: true,
        /**
         * devServer.historyApiFallback的意思是当路径匹配的文件不存在时不出现404,
         * 而是取配置的选项historyApiFallback.index对应的文件
         * 
         * 单页应用(SPA)一般只有一个index.html, 导航的跳转都是基于HTML5 History API，当用户在越过index.html 页面直接访问这个地址或是通过浏览器的刷新按钮重新获取时，就会出现404问题；
         * 比如 直接访问/login, /login/online，这时候越过了index.html，去查找这个地址下的文件。由于这是个一个单页应用，最终结果肯定是查找失败，返回一个404错误。
         * 这个中间件就是用来解决这个问题的；
         * 只要满足下面四个条件之一，这个中间件就会改变请求的地址，指向到默认的index.html:
         * 1 GET请求
         * 2 接受内容格式为text/html
         * 3 不是一个直接的文件请求，比如路径中不带有 .
         * 4 没有 options.rewrites 里的正则匹配
         */
        inline: true,
        /**
         * inline选项会为入口页面添加“热加载”功能，即代码改变后重新加载页面。
         * 
         * 当使用--hot参数时，只能使用hash，如果使用chunkhash会报错
         * 在使用--inline时，hash和chunkhash都可以使用
         * 
         * webpack的hash字段是根据每次编译compilation的内容计算所得，也可以理解为项目总体文件的hash值，而不是针对每个具体文件的。
         * chunkhash是根据模块内容计算出的hash值。
         */
        hot: true,
        contentBase: Root('dist'),
        host: '0.0.0.0',
      },

      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        /**
         * webpack官方文档（devserverhot）中介绍，使用hmr的时候，需要满足两个条件：
         * 配置devServer.hot为true
         * 配置webpack.HotModuleReplacementPlugin插件
         */
        new webpack.DefinePlugin({
          'process.env.D_ENV': isLocal ? '"local"' : '"dev"',
        }),
        new HtmlPlugin({
          template: Root('src/index.html'),
          filename: 'index.html',
          env: isLocal ? 'local' : 'dev',
        }),
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `This APP is runing at：
              - Network: http://${IP}:${PORT}/
              - Local:   http://localhost:${PORT}/
              `,
            ],
          },
        }),
        new webpack.ProgressPlugin(betterProgress({
          mode: 'compact', // or 'detailed' or 'bar'
        })),
      ],
      devtool: 'cheap-module-eval-source-map'
    } as Configuration,

    extra
  );
}