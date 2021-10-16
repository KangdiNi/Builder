/**
 * @description webpack 测试配置
 * @author nikangdi
 * @date 2021-03-08
 */
import { Root } from './utils';
import merge from "webpack-merge";
import * as webpack from "webpack";
import * as HtmlPlugin from 'html-webpack-plugin';
import { getProdBaseConfig, ConfigOptions, Configuration, getBaseConfig } from './base.config';

export function getTestConfig(options: ConfigOptions, extra: Configuration = {}) {
  return merge(
    getProdBaseConfig(options),

    {
      output: {
        publicPath: '/'
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env.D_ENV': '"test"',
        }),
        new HtmlPlugin({
          template: Root('src/index.html'),
          filename: 'index.html',
          env: 'test',
        })
      ],
      devtool: "cheap-module-source-map"
    } as Configuration,

    extra
  );
}