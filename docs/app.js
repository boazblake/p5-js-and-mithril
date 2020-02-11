(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    require('sketch');
});
});

require.register("model.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var range = function range(size) {
  return [].concat(_toConsumableArray(Array(size).keys()));
};

var width = 600;
var height = 600;
var scl = 20;

var w = 1400;
var h = 1000;
var flying = 0;
var colOff = 0;
var rowOff = 0;
var terrain = [[]];
var cols = range(width / scl);
var rows = range(height / scl);

var model = exports.model = {
  scl: scl,
  w: w,
  h: h,
  flying: flying,
  colOff: colOff,
  rowOff: rowOff,
  terrain: terrain,
  cols: cols,
  rows: rows
};
});

;require.register("sketch.js", function(exports, require, module) {
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var range = function range(size) {
  return [].concat(_toConsumableArray(Array(size).keys()));
};

var root = document.getElementById("mithril-dom");

var width = 1000;
var height = 1000;
var w = Stream(1400);
var h = Stream(1000);
var scl = Stream(20);
var flying = Stream(0);
var speed = Stream(-0.2);
var colOff = Stream(0);
var rowOff = Stream(0);
var terrain = Stream([[]]);
var cols = range(w() / scl());
var rows = range(h() / scl());
var rotation = Stream(Math.PI / 3);

var init = function init() {
  return new p5(function (sketch) {
    sketch.preload = function () {};

    sketch.setup = function () {
      sketch.createCanvas(width, height, sketch.WEBGL);

      rows.map(function (row) {
        cols.map(function (col) {
          terrain()[col] = [];
          terrain()[col][row] = 0;
        });
      });
    };

    sketch.draw = function () {
      sketch.rotateX(rotation());
      sketch.translate(-w() / 2, -h() / 2);
      sketch.background("#81D4FA");

      flying(flying() + speed());

      rowOff(flying());
      rows.map(function (row) {
        colOff(0);
        cols.map(function (col) {
          terrain()[col][row] = sketch.map(sketch.noise(colOff(), rowOff()), 0, 1, -100, 100);
          colOff(colOff() + 0.21);
        });
        rowOff(rowOff() + 0.21);
      });

      rows.map(function (row) {
        sketch.beginShape(sketch.TRIANGLE_STRIP);
        cols.map(function (col) {
          sketch.vertex(col * scl(), row * scl(), terrain()[col][row]);
          sketch.vertex(col * scl(), (row + 1) * scl(), terrain()[col][row + 1]);
          if (terrain()[col][row] < -60) {
            sketch.fill("#01579B");
          } else if (terrain()[col][row] > -60 && terrain()[col][row] < -50) {
            sketch.fill("#1B5E20");
          } else if (terrain()[col][row] > -50 && terrain()[col][row] < -40) {
            sketch.fill("#1B5E20");
          } else if (terrain()[col][row] > -40 && terrain()[col][row] < -30) {
            sketch.fill("#2E7D32");
          } else if (terrain()[col][row] > -30 && terrain()[col][row] < -20) {
            sketch.fill("#388E3C");
          } else if (terrain()[col][row] > -20 && terrain()[col][row] < -10) {
            sketch.fill("#43A047");
          } else if (terrain()[col][row] > -10 && terrain()[col][row] < -0) {
            sketch.fill("#4CAF50");
          } else if (terrain()[col][row] > -0 && terrain()[col][row] < 10) {
            sketch.fill("#66BB6A");
          } else if (terrain()[col][row] > 10 && terrain()[col][row] < 20) {
            sketch.fill("#81C784");
          } else if (terrain()[col][row] > 20 && terrain()[col][row] < 30) {
            sketch.fill("#2ecc71");
          } else if (terrain()[col][row] > 30 && terrain()[col][row] < 40) {
            sketch.fill("#A5D6A7");
          } else if (terrain()[col][row] > 40 && terrain()[col][row] < 50) {
            sketch.fill("#C8E6C9");
          } else if (terrain()[col][row] > 50 && terrain()[col][row] < 100) {
            sketch.fill("#ecf0f1");
          }
        });
        sketch.endShape();
        m.redraw();
      });
    };
  });
};

var App = function App() {
  return {
    oninit: init(),
    view: function view(_ref) {
      var _ref$attrs = _ref.attrs,
          w = _ref$attrs.w,
          speed = _ref$attrs.speed,
          scl = _ref$attrs.scl,
          rotation = _ref$attrs.rotation;

      return m(".mithril", [m(".form-group", { style: { position: "absolute", top: "10px", color: "white" } }, [m("input[type=range]", {
        val: scl(),
        id: "scale",
        min: 0,
        max: 30,
        step: 0.1,
        oninput: function oninput(e) {
          return scl(e.target.value);
        }
      }), m("label", { for: "scale" }, "scale: " + scl())]), m(".form-group", { style: { position: "absolute", top: "30px", color: "white" } }, [m("input[type=range]", {
        val: speed(),
        id: "speed",
        min: -1,
        max: 1,
        step: 0.1,
        oninput: function oninput(e) {
          return speed(Number(e.target.value));
        }
      }), m("label", { for: "speed" }, "speed: " + speed())]), m(".form-group", {
        style: {
          position: "absolute",
          top: "10px",
          left: "50%",
          color: "white"
        }
      }, [m("button", {
        onclick: function onclick() {
          return rotation(rotation() + 0.1);
        },
        id: "rotateXUp",
        style: {
          fontSize: "50px"
        }
      }, "Up")]), m(".form-group", {
        style: {
          position: "absolute",
          bottom: "10px",
          left: "50%",
          color: "white"
        }
      }, [m("button", {
        onclick: function onclick() {
          return rotation(rotation() - 0.1);
        },
        id: "rotateXDown",
        style: {
          fontSize: "50px"
        }
      }, "Down")]), m(".form-group", {
        style: {
          position: "absolute",
          left: "10px",
          color: "white"
        }
      }, [m("button", {
        onclick: function onclick() {
          return w(w() - 100);
        },
        id: "pan-left",
        style: {
          fontSize: "50px"
        }
      }, "Left")]), m(".form-group", {
        style: {
          position: "absolute",
          right: "10px",
          color: "white"
        }
      }, [m("button", {
        onclick: function onclick() {
          return w(w() + 100);
        },
        id: "pan-right",
        style: {
          fontSize: "50px"
        }
      }, "Right")])]);
    }
  };
};

m.mount(root, { view: function view() {
    return m(App, { w: w, h: h, scl: scl, rotation: rotation, speed: speed });
  } });
});

;require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.Stream = require("mithril-stream/stream.js");
window.m = require("mithril");


});})();require('___globals___');

require('initialize');
//# sourceMappingURL=app.js.map