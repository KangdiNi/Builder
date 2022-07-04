/* eslint-disable */
const {
  getProdConfig,
  Root
} = require('@didi/ora-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = getProdConfig({
  report: process.env.REPORT === 'true',
  static: '//static.didiglobal.com/ibt/pope-next/',
}, {
  output: {
    publicPath: '//static.didiglobal.com/ibt/pope-next/',
  },
  resolve: {
    alias: {
      vars: Root('src/assets/styles/vars.scss'),
      reset: Root('src/assets/styles/reset.scss'),
    },
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
          loader: 'css-loader'
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
              strictMath: false,
            },
          },
        },
      ],
    }, ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: Root('control.sh'),
        to: '.'
      }]
    }),
  ],
});