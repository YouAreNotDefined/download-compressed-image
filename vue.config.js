const { defineConfig } = require('@vue/cli-service')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ],
  },
})
