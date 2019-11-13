/* eslint-disable */

const config = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    node: {
      __filename: true,
    },
  }
};

// config.chainWebpack = config => {
//   config.resolve.symlinks(false)
//   config.module.rule('eslint').use('eslint-loader').tap(options => {
//     options.fix = true
//     return options
//   })
// }

module.exports = config;
