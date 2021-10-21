module.exports = {
  lintOnSave: true,
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.ts",
      title: "Popup",
    },
    options: {
      template: "public/browser-extension.html",
      entry: "./src/options/main.ts",
      title: "Options",
    },
  },
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        contentScripts: true,
      },
      componentOptions: {
        background: {
          entry: "src/background.ts",
        },
        contentScripts: {
          entries: {
            "content-script": ["src/content-scripts/content-script.ts"],
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {},
    });
    config
      .entry("inject-emeris")
      .add("./src/content-scripts/inject-emeris.ts")
      .end();
  },
};
