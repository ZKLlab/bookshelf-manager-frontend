module.exports = {
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
  },
};
