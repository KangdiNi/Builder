/* eslint-disable */
const {
  getTestConfig,
  Root
} = require('@didi/ora-webpack');

module.exports = getTestConfig({
  static: '//img0.didiglobal.com/static/magellan_test/pope-next',
}, {
  output: {
    publicPath: '//img0.didiglobal.com/static/magellan_test/pope-next',
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
});