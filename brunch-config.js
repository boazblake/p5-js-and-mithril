exports.files = {
  javascripts: {
    joinTo: {
      "vendor.js": /^(?!app)/, // Files that are not in `app` dir.
      "app.js": /^app/
    }
  },
  stylesheets: {
    joinTo: {
      "app.css": [
        (path) => path.includes(".scss"),
        (path) => path.includes(".css")
      ]
    }
  }
}

exports.modules = {
  autoRequire: {
    "app.js": ["initialize"]
  }
}

exports.npm = {
  globals: { m: "mithril" }
}
exports.paths = {
  public: "docs"
}

exports.plugins = {
  babel: {
    presets: ["env"],
    ignore: /^node_modules/
  },
  uglify: {
    ignored: /^node_modules/
  },
  copycat: {
    modules: [
      "node_modules/p5/lib/p5.min.js",
      "node_modules/p5/lib/addons/p5.sound.min.js"
    ],
    images: ["app/images"],
    verbose: true,
    onlyChanged: true
  }
}
