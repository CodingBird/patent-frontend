const path = require('path');

export default {
  proxy: {
    '/api/test': {
      target: 'http://localhost:7001',
      // target: 'http://192.168.100.68:7001',
      changeOrigin: true,
      pathRewrite: { '^/api/test': '' },
    },
  },
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
