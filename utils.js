"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionBody = getFunctionBody;
exports.setDescriptor = setDescriptor;
exports.setDescriptors = setDescriptors;
exports.propertyIsAccessor = propertyIsAccessor;
exports.getInheritedDescriptor = getInheritedDescriptor;
exports.getInheritedPropertyNames = getInheritedPropertyNames;
exports.Constructor = Constructor;
exports.WeakTwoWayMap = void 0;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class WeakTwoWayMap {
  constructor() {
    this.m = new WeakMap();
  }

  set(a, b) {
    this.m.set(a, b);
    this.m.set(b, a);
  }

  get(item) {
    return this.m.get(item);
  }

  has(item) {
    return this.m.has(item);
  }

}

exports.WeakTwoWayMap = WeakTwoWayMap;

// assumes the function opening, body, and closing are on separate lines
function getFunctionBody(fn) {
  const code = fn.toString().split("\n");
  code.shift(); // remove opening line (function() {)

  code.pop(); // remove closing line (})

  return code.join("\n");
}

const descriptorDefaults = {
  enumerable: true,
  configurable: true // makes it easier and less verbose to work with descriptors

};

function setDescriptor(obj, key, newDescriptor, inherited = false) {
  let currentDescriptor = inherited ? getInheritedDescriptor(obj, key) : Object.getOwnPropertyDescriptor(obj, key);
  newDescriptor = overrideDescriptor(currentDescriptor, newDescriptor);
  Object.defineProperty(obj, key, newDescriptor);
}

function setDescriptors(obj, newDescriptors) {
  let newDescriptor;
  let currentDescriptor;
  const currentDescriptors = Object.getOwnPropertyDescriptors(obj);

  for (const key in newDescriptors) {
    newDescriptor = newDescriptors[key];
    currentDescriptor = currentDescriptors[key];
    newDescriptors[key] = overrideDescriptor(currentDescriptor, newDescriptor);
  }

  Object.defineProperties(obj, newDescriptors);
}

function overrideDescriptor(oldDescriptor, newDescriptor) {
  if (('get' in newDescriptor || 'set' in newDescriptor) && ('value' in newDescriptor || 'writable' in newDescriptor)) {
    throw new TypeError('cannot specify both accessors and a value or writable attribute');
  }

  if (oldDescriptor) {
    if ('get' in newDescriptor || 'set' in newDescriptor) {
      delete oldDescriptor.value;
      delete oldDescriptor.writable;
    } else if ('value' in newDescriptor || 'writable' in newDescriptor) {
      delete oldDescriptor.get;
      delete oldDescriptor.set;
    }
  }

  return _objectSpread({}, descriptorDefaults, oldDescriptor, newDescriptor);
}

function propertyIsAccessor(obj, key, inherited = true) {
  let result = false;
  let descriptor;

  if (arguments.length === 1) {
    descriptor = obj;
  } else {
    descriptor = inherited ? getInheritedDescriptor(obj, key) : Object.getOwnPropertyDescriptor(obj, key);
  }

  if (descriptor && (descriptor.get || descriptor.set)) result = true;
  return result;
}

function getInheritedDescriptor(obj, key) {
  let currentProto = obj;
  let descriptor;

  while (currentProto) {
    descriptor = Object.getOwnPropertyDescriptor(currentProto, key);

    if (descriptor) {
      descriptor.owner = currentProto;
      return descriptor;
    }

    currentProto = currentProto.__proto__;
  }
}

function getInheritedPropertyNames(obj) {
  let currentProto = obj;
  let keys = [];

  while (currentProto) {
    keys = keys.concat(Object.getOwnPropertyNames(currentProto));
    currentProto = currentProto.__proto__;
  } // remove duplicates


  keys = Array.from(new Set(keys));
  return keys;
} // this is used for type casting in special cases, see the declaration file


function Constructor(Ctor) {
  return Ctor;
}