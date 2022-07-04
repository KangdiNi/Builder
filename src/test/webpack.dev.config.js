/* eslint-disable */
const {
  getDevConfig,
  Root
} = require('@didi/ora-webpack');

module.exports = getDevConfig({}, {
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