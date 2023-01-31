const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@common': path.resolve(__dirname, 'src/common/'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@customTypes': path.resolve(__dirname, 'src/types/'),
      '@store': path.resolve(__dirname, 'src/store/'),
    },
  },
};
