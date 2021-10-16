/**
 * @description webpack 生产配置 pre/prod
 * @author nikangdi
 * @date 2021-03-09
 */
import { Root } from './utils';
import merge from "webpack-merge";
import * as webpack from "webpack";
import * as HtmlPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { getProdBaseConfig, ConfigOptions, Configuration } from './base.config';

function createProdConfig(options: ConfigOptions, extra: Configuration = {}) {
  const config: Configuration = merge(
    getProdBaseConfig(options),

    {
      output: {
        publicPath: `${options.static}/${options.moduleName}/`,
      },

      plugins: [
        new webpack.DefinePlugins({
          'process.env.D_ENV': '"production"',
        }),

        new HtmlPlugin({
          template: Root('src/index.html'),
          filename: 'index.html',
          env: 'production',
        }),
      ] as any,
    },
    extra
  );

  if (options.report) {
    config.plugins = config.plugins || [];

    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        /**
         *   可以是`server`，`static`或`disabled`。
         *   在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
         *   在“静态”模式下，会生成带有报告的单个HTML文件。
         *   在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
         * 
         */

        analyzerHost: '127.0.0.1', //  将在“服务器”模式下使用的主机启动HTTP服务器。
        analyzerPort: 9999,//  将在“服务器”模式下使用的端口启动HTTP服务器。
        reportFilename: 'report.html',//  路径捆绑，将在`static`模式下生成的报告文件。 相对于捆绑输出目录。
        defaultSizes: 'parsed',//  模块大小默认显示在报告中。应该是`stat`，`parsed`或者`gzip`中的一个。
        openAnalyzer: true,//  在默认浏览器中自动打开报告
        generateStatsFile: false,//  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        statsFilename: 'stats.json',//  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。  相对于捆绑输出目录。
        statsOptions: null,
        /**
         *   stats.toJson（）方法的选项。
         *   例如，您可以使用`source：false`选项排除统计文件中模块的来源。
         *   在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
         */
        logLevel: 'info',// 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
      })
    );
  }


  return config;
}

function createPreConfig(options: ConfigOptions, extra: Configuration = {}) {
  return merge(
    getProdBaseConfig(options),

    {
      output: {
        publicPath: `${options.static}/${options.moduleName}/`,
        // 静态文件CDN
      },

      plugins: [
        new webpack.DefinePlugins({
          'process.env.D_ENV': '"pre"'
        }),
        new HtmlPlugin({
          template: Root('src/index.html'),
          filename: 'pre_index.html',
          env: 'production',
        })
      ] as any,
    },
    extra
  )
};

export function getProdConfig(options: ConfigOptions, extra: Configuration = {}) {
  return [createProdConfig(options, extra), createPreConfig(options, extra)];
};