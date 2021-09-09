module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Image Optimization',
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'Image Optimization',
        mac: {
          icon: './icon.png',
        },
        win: {
          icon: './icon.png',
        },
        linux: {
          icon: './icon.png',
        },
      },
    },
  },
};
