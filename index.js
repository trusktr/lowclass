"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true,
  instanceOf: true
};
Object.defineProperty(exports, "instanceOf", {
  enumerable: true,
  get: function () {
    return _instanceOf.default;
  }
});
exports.version = exports.default = void 0;

var _Class = _interopRequireDefault(require("./Class"));

Object.keys(_Class).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Class[key];
    }
  });
});

var _Mixin = require("./Mixin");

Object.keys(_Mixin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Mixin[key];
    }
  });
});

var _instanceOf = _interopRequireDefault(require("./instanceOf"));

var _native = require("./native");

Object.keys(_native).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _native[key];
    }
  });
});

var _utils = require("./utils");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the bread and butter
var _default = _Class.default; // mix and match your classes!

exports.default = _default;
const version = '4.6.2';
exports.version = version;