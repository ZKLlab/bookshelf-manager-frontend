module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://books.dev.cloud.shuosc.com',
        changeOrigin: true,
      },
    },
  },
  pages: {
    reader: {
      entry: 'src/pages/reader/main.js',
      template: 'public/reader.html',
      filename: 'index.html',
      title: 'SHUOSC Bookshelf Manager',
      chunks: ['chunk-vendors', 'chunk-common', 'reader'],
    },
    admin: {
      entry: 'src/pages/admin/main.js',
      template: 'public/admin.html',
      filename: 'admin.html',
      title: 'SHUOSC Bookshelf Manager - Admin',
      chunks: ['chunk-vendors', 'chunk-common', 'admin'],
    },
    'signin-callback': {
      entry: 'src/pages/signin-callback/main.js',
      template: 'public/callback.html',
      filename: 'signin-callback.html',
      title: 'SHUOSC Bookshelf Manager',
      chunks: ['chunk-vendors', 'chunk-common', 'signin-callback'],
    },
    'silent-signin-callback': {
      entry: 'src/pages/silent-signin-callback/main.js',
      template: 'public/blank.html',
      filename: 'silent-signin-callback.html',
      title: 'SHUOSC Bookshelf Manager',
      chunks: ['chunk-vendors', 'chunk-common', 'silent-signin-callback'],
    },
  },
};
