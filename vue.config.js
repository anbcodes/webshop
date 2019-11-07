/* eslint-disable */

const config = {
  transpileDependencies: [
    'vuetify',
  ],
};

config.chainWebpack = config => {
  config.resolve.symlinks(false)
  config.module.rule('eslint').use('eslint-loader').tap(options => {
    options.fix = true
    return options
  })
}

module.exports = config;
