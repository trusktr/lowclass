var lowclass =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return WeakTwoWayMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getFunctionBody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return setDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return setDescriptors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return propertyIsAccessor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getInheritedDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getInheritedPropertyNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constructor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return hasPrototype; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return copyDescriptors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return setDefaultPrototypeDescriptors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return setDefaultStaticDescriptors; });
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO no any
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

} // assumes the function opening, body, and closing are on separate lines

function getFunctionBody(fn) {
  const code = fn.toString().split('\n');
  code.shift(); // remove opening line (function() {)

  code.pop(); // remove closing line (})

  return code.join('\n');
}
const descriptorDefaults = {
  enumerable: true,
  configurable: true
}; // makes it easier and less verbose to work with descriptors

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
} // TODO use signature override


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
      ;
      descriptor.owner = currentProto;
      return descriptor;
    }

    currentProto = currentProto.__proto__;
  }

  return void 0;
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
} // check if an object has the given prototype in its chain

function hasPrototype(obj, proto) {
  let currentProto = obj.__proto__;

  do {
    if (proto === currentProto) return true;
    currentProto = currentProto.__proto__;
  } while (currentProto);

  return false;
} // copy all properties (as descriptors) from source to destination

function copyDescriptors(source, destination, mod) {
  const props = Object.getOwnPropertyNames(source);
  let i = props.length;

  while (i--) {
    const prop = props[i];
    const descriptor = Object.getOwnPropertyDescriptor(source, prop);
    if (mod) mod(descriptor);
    Object.defineProperty(destination, prop, descriptor);
  }
}
function setDefaultPrototypeDescriptors(prototype, {
  defaultClassDescriptor: {
    writable,
    enumerable,
    configurable
  }
}) {
  const descriptors = Object.getOwnPropertyDescriptors(prototype);
  let descriptor;

  for (const key in descriptors) {
    descriptor = descriptors[key]; // regular value

    if ('value' in descriptor || 'writable' in descriptor) {
      descriptor.writable = writable;
    } // accessor or regular value


    descriptor.enumerable = enumerable;
    descriptor.configurable = configurable;
  }

  setDescriptors(prototype, descriptors);
}
function setDefaultStaticDescriptors(Ctor, {
  defaultClassDescriptor: {
    writable,
    enumerable,
    configurable
  }
}, staticBlacklist) {
  const descriptors = Object.getOwnPropertyDescriptors(Ctor);
  let descriptor;

  for (const key in descriptors) {
    if (staticBlacklist && staticBlacklist.includes(key)) {
      delete descriptors[key];
      continue;
    }

    descriptor = descriptors[key]; // regular value

    if ('value' in descriptor || 'writable' in descriptor) {
      descriptor.writable = writable;
    } // accessor or regular value


    descriptor.enumerable = enumerable;
    descriptor.configurable = configurable;
  }

  setDescriptors(Ctor, descriptors);
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return newless; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
// borrowed from (and slightly modified) https://github.com/Mr0grog/newless
// The newless license is BSD 3:
// TODO no any types

/*
 * Copyright (c) 2013-2016, Rob Brackett
 * Copyright (c) 2018, Joseph Orbegoso Pea
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


/* unused harmony default export */ var _unused_webpack_default_export = (newless);
var supportsSpread = isSyntaxSupported('Object(...[{}])');
var supportsClass = isSyntaxSupported('class Test {}');
var supportsNewTarget = isSyntaxSupported('new.target'); // Used to track the original wrapped constructor on a newless instance

var TRUE_CONSTRUCTOR = Symbol ? Symbol('trueConstructor') : '__newlessTrueConstructor__';

var setPrototype = Object.setPrototypeOf || function setPrototypeOf(object, newPrototype) {
  object.__proto__ = newPrototype;
}; // Polyfill for Reflect.construct


var construct = Reflect && Reflect.construct || function () {
  if (supportsClass) {
    return Function('constructor, args, target', `
                'use strict';

                if (arguments.length === 3 && typeof target !== 'function')
                    throw new TypeError(target + ' is not a constructor');

                target = target || constructor;

                // extend target so the right prototype is constructed (or nearly the
                // right one; ideally we'd do instantiator.prototype = target.prototype,
                // but a class's prototype property is not writable)
                class instantiator extends target {};
                // but ensure the *logic* is 'constructor' for ES2015-compliant engines
                Object.setPrototypeOf(instantiator, constructor);
                // ...and for Safari 9
                instantiator.prototype.constructor = constructor;

                // The spread operator is *dramatically faster, so use it if we can:
                // http://jsperf.com/new-via-spread-vs-dynamic-function/4
                ${supportsSpread ? `

                    var value = new instantiator(...([].slice.call(args)));

                ` : `

                    // otherwise, create a dynamic function in order to use 'new'
                    // Note using 'function.bind' would be simpler, but is much slower:
                    // http://jsperf.com/new-operator-with-dynamic-function-vs-bind
                    var argList = '';
                    for (var i = 0, len = args.length; i < len; i++) {
                    if (i > 0) argList += ',';
                    argList += 'args[' + i + ']';
                    }
                    var constructCall = Function('constructor, args',
                    'return new constructor( ' + argList + ' );'
                    );
                    var value = constructCall(constructor, args);

                    args = Array.prototype.slice.call(args);
                    args = [null].concat(args);
                    var value = new constructor.bind.apply(constructor, args);

                `}

                // fix up the prototype so it matches the intended one, not one who's
                // prototype is the intended one :P
                Object.setPrototypeOf(value, target.prototype);
                return value;
            `); //return Function("constructor, args, newTarget", `
    //  'use strict';
    //  if (arguments.length === 3 && typeof newTarget === undefined)
    //    throw new TypeError('undefined is not a constructor');
    //  newTarget = newTarget || constructor;
    //  ${ supportsSpread ? `
    //    var value = new constructor(...([].slice.call(args)));
    //  `:`
    //    args = Array.prototype.slice.call(args);
    //    args = [null].concat(args);
    //    var value = new constructor.bind.apply(constructor, args);
    //  `}
    //  Object.setPrototypeOf(value, newTarget.prototype);
    //  return value;
    //`);
  } else {
    var instantiator = function () {};

    return function construct(constructor, args, target) {
      if (arguments.length === 3 && typeof target !== 'function') throw new TypeError(target + ' is not a constructor');
      instantiator.prototype = (target || constructor).prototype;
      var instance = new instantiator();
      var value = constructor.apply(instance, args);

      if (typeof value === 'object' && value) {
        // we can do better if __proto__ is available (in some ES5 environments)
        value.__proto__ = (target || constructor).prototype;
        return value;
      }

      return instance;
    };
  }
}(); // ES2015 class methods are non-enumerable; we need a helper for copying them.


var SKIP_PROPERTIES = ['arguments', 'caller', 'length', 'name', 'prototype'];

function copyProperties(source, destination) {
  if (Object.getOwnPropertyNames && Object.defineProperty) {
    var properties = Object.getOwnPropertyNames(source);

    if (Object.getOwnPropertySymbols) {
      properties = properties.concat(Object.getOwnPropertySymbols(source));
    }

    for (var i = properties.length - 1; i >= 0; i--) {
      if (SKIP_PROPERTIES.indexOf(properties[i]) === -1) {
        Object.defineProperty(destination, properties[i], Object.getOwnPropertyDescriptor(source, properties[i]));
      }
    }
  } else {
    for (var property in source) {
      destination[property] = source[property];
    }
  }
}

function newless(constructor) {
  var name = constructor.name; // V8 and newer versions of JSCore return the full class declaration from
  // `toString()`, which lets us be a little smarter and more performant
  // about what to do, since we know we are dealing with a "class". Note,
  // however, not all engines do this. This could be false and the constructor
  // might still use class syntax.

  var usesClassSyntax = constructor.toString().substr(0, 5) === 'class';
  var requiresNew = usesClassSyntax ? true : null;

  var newlessConstructor = (() => function () {
    // If called with an already valid 'this', preserve that 'this' value
    // in the super-type's constructor whenever possible. With function
    // constructors (as opposed to class constructors), it's possible to
    // alter the instance before calling the super constructor--so it's
    // important to preserve that instance if at all possible.
    if (!requiresNew && this instanceof newlessConstructor) {
      // requiresNew = 'false' indicates we know the 'new' operator isn't
      // necessary for this constructor, but 'null' indicates uncertainty,
      // so the call needs to handle potential errors the first time in
      // order to determine whether 'new' is definitely required.
      if (requiresNew === false) {
        const returnValue = constructor.apply(this, arguments);
        return typeof returnValue === 'object' && returnValue || this;
      }

      try {
        requiresNew = false;
        const returnValue = constructor.apply(this, arguments);
        return typeof returnValue === 'object' && returnValue || this;
      } catch (error) {
        // Do our best to only capture errors triggred by class syntax.
        // Unfortunately, there's no special error type for this and the
        // message is non-standard, so this is the best check we can do.
        if (error instanceof TypeError && (/class constructor/i.test(error.message) || /use the 'new' operator/i.test(error.message)) // Custom Elements in Chrome
        // TODO: there might be other error messages we need to catch,
        // depending on engine and use case. We need to test in all browsers
        ) {
            // mark this constructor as requiring 'new' for next time
            requiresNew = true;
          } else {
          if (/Illegal constructor/i.test(error.message) && Object.create(constructor.prototype) instanceof Node) {
            console.error(`The following error can happen if a Custom Element is called
with 'new' before being defined. The constructor was ${constructor.name}: `, constructor);
          }

          throw error;
        }
      }
    } // make a reasonably good replacement for 'new.target' which is a
    // syntax error in older engines


    var newTarget;
    var hasNewTarget = false;

    if (supportsNewTarget) {
      eval('newTarget = new.target');
      if (newTarget) hasNewTarget = true;
    }

    if (!supportsNewTarget || !hasNewTarget) {
      newTarget = this instanceof newlessConstructor ? this.constructor : constructor;
    }

    const returnValue = construct(constructor, arguments, newTarget); // best effort to make things easy for functions inheriting from classes

    if (this instanceof newlessConstructor) {
      setPrototype(this, returnValue);
    }

    return returnValue;
  })();

  if (name) {
    const code = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* getFunctionBody */ "d"])(newlessConstructor);
    newlessConstructor = Function('constructor, construct, setPrototype, requiresNew, supportsNewTarget', `
      var newlessConstructor = function ${name}() { ${code} };
      return newlessConstructor
    `)(constructor, construct, setPrototype, requiresNew, supportsNewTarget);
  } // copy the `.length` value to the newless constructor


  if (constructor.length) {
    // length is not writable, only configurable, therefore the value
    // has to be set with a descriptor update
    Object(_utils__WEBPACK_IMPORTED_MODULE_0__[/* setDescriptor */ "k"])(newlessConstructor, 'length', {
      value: constructor.length
    });
  }

  newlessConstructor.prototype = Object.create(constructor.prototype);
  newlessConstructor.prototype.constructor = newlessConstructor; // NOTE: *usually* the below will already be true, but we ensure it here.
  // Safari 9 requires this for the 'super' keyword to work. Newer versions
  // of WebKit and other engines do not. Instead, they use the constructor's
  // prototype chain (which is correct by ES2015 spec) (see below).

  constructor.prototype.constructor = constructor;
  newlessConstructor[TRUE_CONSTRUCTOR] = constructor;
  copyProperties(constructor, newlessConstructor);
  setPrototype(newlessConstructor, constructor);
  return newlessConstructor;
} // Test whether a given syntax is supported


function isSyntaxSupported(example, useStrict = true) {
  try {
    return !!Function('', (useStrict ? "'use strict';" : '') + example);
  } catch (error) {
    return false;
  }
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/utils.ts
var utils = __webpack_require__(0);

// CONCATENATED MODULE: ./src/Class.ts
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO
//  [x] remove the now-unnecessary modes (leave just what was 'es5' mode)
//  [x] link helpers to each other, making it possible to destructure the arguments to definer functions
//  [x] let access helper prototype objects extend from Object, otherwise common tools are not available.
//  [x] accept a function as return value of function definer, to be treated as a class to derive the definition from, so that it can have access to Protected and Private helpers
//  [x] let the returned class define protected and private getters which return the protected and private definitions.
//  [x] migrate to builder-js-package so tests can run in the browser, and we can test custom elements
//  [ ] protected and private static members
//  [ ] no `any` types
//  [ ] other TODOs in the code


const staticBlacklist = ['subclass', 'extends', ...Object.getOwnPropertyNames(new Function())];
const publicProtoToProtectedProto = new WeakMap();
const publicProtoToPrivateProto = new WeakMap(); // A two-way map to associate public instances with protected instances.
// There is one protected instance per public instance

const publicToProtected = new utils["b" /* WeakTwoWayMap */](); // so we can get the class scope associated with a private instance

const privateInstanceToClassScope = new WeakMap();
const brandToPublicPrototypes = new WeakMap();
const brandToProtectedPrototypes = new WeakMap();
const brandToPrivatePrototypes = new WeakMap();
const brandToPublicsPrivates = new WeakMap();
const defaultOptions = {
  // es5 class inheritance is simple, nice, easy, and robust
  // There was another mode, but it has been removed
  mode: 'es5',
  // false is better for performance, but true will use Function (similar to
  // eval) to name your class functions in the most accurate way.
  nativeNaming: false,
  // similar to ES6 classes:
  prototypeWritable: false,
  defaultClassDescriptor: {
    writable: true,
    enumerable: false,
    configurable: true
  },
  setClassDescriptors: true
};
class InvalidSuperAccessError extends Error {}
class InvalidAccessError extends Error {}
const Class_Class = createClassHelper();
function createClassHelper(options) {
  options = options ? _objectSpread({}, defaultOptions, options) : defaultOptions;
  options.defaultClassDescriptor = _objectSpread({}, defaultOptions.defaultClassDescriptor, options.defaultClassDescriptor);
  const {
    mode,
    prototypeWritable,
    setClassDescriptors,
    nativeNaming
  } = options;

  function Class(...args) {
    let usingStaticSubclassMethod = false; // if called as SomeConstructor.subclass, or bound to SomeConstructor

    if (typeof this === 'function') usingStaticSubclassMethod = true; // f.e. `Class()`, `Class('Foo')`, `Class('Foo', {...})` , `Class('Foo',
    // {...}, Brand)`, similar to `class {}`, `class Foo {}`, class Foo
    // {...}, and class Foo {...} with branding (see comments on classBrand
    // below regarding positional privacy)

    if (args.length <= 3) {
      let name = '';
      let definer = null;
      let classBrand = null; // f.e. `Class('Foo')`

      if (typeof args[0] === 'string') name = args[0]; // f.e. `Class((pub, prot, priv) => ({ ... }))`
      else if (typeof args[0] === 'function' || typeof args[0] === 'object') {
          definer = args[0];
          classBrand = args[1];
        } // f.e. `Class('Foo', (pub, prot, priv) => ({ ... }))`

      if (typeof args[1] === 'function' || typeof args[1] === 'object') {
        definer = args[1];
        classBrand = args[2];
      } // Make a class in case we wanted to do just `Class()` or
      // `Class('Foo')`...


      const Ctor = usingStaticSubclassMethod ? createClass.call(this, name, definer, classBrand) : createClass(name, definer, classBrand); // ...but add the extends helper in case we wanted to do like:
      // Class().extends(OtherClass, (Public, Protected, Private) => ({
      //   ...
      // }))

      Ctor.extends = function (ParentClass, def, brand) {
        def = def || definer;
        brand = brand || classBrand;
        return createClass.call(ParentClass, name, def, brand);
      };

      return Ctor;
    }

    throw new TypeError('invalid args');
  }

  return Class;
  /**
   * @param {string} className The name that the class being defined should
   * have.
   * @param {Function} definer A function or object for defining the class.
   * If definer a function, it is passed the Public, Protected, Private, and
   * Super helpers. Methods and properties can be defined on the helpers
   * directly.  An object containing methods and properties can also be
   * returned from the function. If definer is an object, the object should
   * be in the same format as the one returned if definer were a function.
   */

  function createClass(className, definer, classBrand) {
    'use strict'; // f.e. ParentClass.subclass((Public, Protected, Private) => {...})

    let ParentClass = this;

    if (typeof className !== 'string') {
      throw new TypeError(`
                You must specify a string for the 'className' argument.
            `);
    }

    let definition = null; // f.e. Class('Foo', { ... })

    if (definer && typeof definer === 'object') {
      definition = definer;
    } // Return early if there's no definition or parent class, just a simple
    // extension of Object. f.e. when doing just `Class()` or
    // `Class('Foo')`
    else if (!ParentClass && (!definer || typeof definer !== 'function' && typeof definer !== 'object')) {
        let Ctor;
        if (nativeNaming && className) Ctor = new Function(`return function ${className}() {}`)();else {
          // force anonymous even in ES6+
          Ctor = (() => function () {})();

          if (className) Object(utils["k" /* setDescriptor */])(Ctor, 'name', {
            value: className
          });
        }
        Ctor.prototype = {
          __proto__: Object.prototype,
          constructor: Ctor
        }; // no static inheritance here, just like with `class Foo {}`

        Object(utils["k" /* setDescriptor */])(Ctor, 'subclass', {
          value: Class,
          writable: true,
          enumerable: false,
          configurable: false
        });
        return Ctor;
      } // A two-way map to associate public instances with private instances.
    // Unlike publicToProtected, this is inside here because there is one
    // private instance per class scope per instance (or to say it another
    // way, each instance has as many private instances as the number of
    // classes that the given instance has in its inheritance chain, one
    // private instance per class)


    const scopedPublicsToPrivates = classBrand ? void undefined : new utils["b" /* WeakTwoWayMap */]();

    if (classBrand) {
      if (!brandToPublicsPrivates.get(classBrand)) brandToPublicsPrivates.set(classBrand, new utils["b" /* WeakTwoWayMap */]());
    } // if no brand provided, then we use the most fine-grained lexical
    // privacy. Lexical privacy is described at
    // https://github.com/tc39/proposal-class-fields/issues/60
    //
    // TODO make prototypes non-configurable so that the clasds-brand system
    // can't be tricked. For now, it's good enough, most people aren't going
    // to go out of their way to mangle with the prototypes in order to
    // force invalid private access.


    classBrand = classBrand || {
      brand: 'lexical'
    }; // the class "scope" that we will bind to the helper functions

    const scope = {
      className,

      get publicToPrivate() {
        return scopedPublicsToPrivates ? scopedPublicsToPrivates : brandToPublicsPrivates.get(classBrand);
      },

      classBrand,
      // we use these to memoize the Public/Protected/Private access
      // helper results, to make subsequent accessses faster.
      cachedPublicAccesses: new WeakMap(),
      cachedProtectedAccesses: new WeakMap(),
      cachedPrivateAccesses: new WeakMap()
    }; // create the super helper for this class scope

    const supers = new WeakMap();
    const Super = superHelper.bind(null, supers, scope); // bind this class' scope to the helper functions

    const Public = getPublicMembers.bind(null, scope);
    const Protected = getProtectedMembers.bind(null, scope);
    const Private = getPrivateMembers.bind(null, scope);
    Public.prototype = {};
    Protected.prototype = {};
    Private.prototype = {}; // alows the user to destructure arguments to definer functions

    Public.Public = Public;
    Public.Protected = Protected;
    Public.Private = Private;
    Public.Super = Super;
    Protected.Public = Public;
    Protected.Protected = Protected;
    Protected.Private = Private;
    Protected.Super = Super; // Private and Super are never passed as first argument
    // pass the helper functions to the user's class definition function

    definition = definition || definer && definer(Public, Protected, Private, Super); // the user has the option of returning an object that defines which
    // properties are public/protected/private.

    if (definition && typeof definition !== 'object' && typeof definition !== 'function') {
      throw new TypeError(`
                The return value of a class definer function, if any, should be
                an object, or a class constructor.
            `);
    } // if a function was returned, we assume it is a class from which we
    // get the public definition from.


    let customClass = null;

    if (typeof definition === 'function') {
      customClass = definition;
      definition = definition.prototype;
      ParentClass = customClass.prototype.__proto__.constructor;
    }

    let staticMembers; // if functions were provided for the public/protected/private
    // properties of the definition object, execute them with their
    // respective access helpers, and use the objects returned from them.

    if (definition) {
      staticMembers = definition.static;
      delete definition.static;

      if (typeof definition.public === 'function') {
        definition.public = definition.public(Protected, Private);
      }

      if (typeof definition.protected === 'function') {
        definition.protected = definition.protected(Public, Private);
      }

      if (typeof definition.private === 'function') {
        definition.private = definition.private(Public, Protected);
      }
    }

    ParentClass = ParentClass || Object; // extend the parent class

    const parentPublicPrototype = ParentClass.prototype;
    const publicPrototype = definition && definition.public || definition || Object.create(parentPublicPrototype);
    if (publicPrototype.__proto__ !== parentPublicPrototype) publicPrototype.__proto__ = parentPublicPrototype; // extend the parent protected prototype

    const parentProtectedPrototype = getParentProtectedPrototype(parentPublicPrototype);
    const protectedPrototype = definition && definition.protected || Object.create(parentProtectedPrototype);
    if (protectedPrototype.__proto__ !== parentProtectedPrototype) protectedPrototype.__proto__ = parentProtectedPrototype;
    publicProtoToProtectedProto.set(publicPrototype, protectedPrototype); // private prototype inherits from parent, but each private instance is
    // private only for the class of this scope

    const parentPrivatePrototype = getParentPrivatePrototype(parentPublicPrototype);
    const privatePrototype = definition && definition.private || Object.create(parentPrivatePrototype);
    if (privatePrototype.__proto__ !== parentPrivatePrototype) privatePrototype.__proto__ = parentPrivatePrototype;
    publicProtoToPrivateProto.set(publicPrototype, privatePrototype);
    if (!brandToPublicPrototypes.get(classBrand)) brandToPublicPrototypes.set(classBrand, new Set());
    if (!brandToProtectedPrototypes.get(classBrand)) brandToProtectedPrototypes.set(classBrand, new Set());
    if (!brandToPrivatePrototypes.get(classBrand)) brandToPrivatePrototypes.set(classBrand, new Set());
    brandToPublicPrototypes.get(classBrand).add(publicPrototype);
    brandToProtectedPrototypes.get(classBrand).add(protectedPrototype);
    brandToPrivatePrototypes.get(classBrand).add(privatePrototype);
    scope.publicPrototype = publicPrototype;
    scope.privatePrototype = privatePrototype;
    scope.protectedPrototype = protectedPrototype;
    scope.parentPublicPrototype = parentPublicPrototype;
    scope.parentProtectedPrototype = parentProtectedPrototype;
    scope.parentPrivatePrototype = parentPrivatePrototype; // the user has the option of assigning methods and properties to the
    // helpers that we passed in, to let us know which methods and
    // properties are public/protected/private so we can assign them onto
    // the respective prototypes.

    Object(utils["c" /* copyDescriptors */])(Public.prototype, publicPrototype);
    Object(utils["c" /* copyDescriptors */])(Protected.prototype, protectedPrototype);
    Object(utils["c" /* copyDescriptors */])(Private.prototype, privatePrototype);

    if (definition) {
      // delete these so we don't expose them on the class' public
      // prototype
      delete definition.public;
      delete definition.protected;
      delete definition.private; // if a `public` object was also supplied, we treat that as the public
      // prototype instead of the base definition object, so we copy the
      // definition's props to the `public` object
      //
      // TODO For now we copy from the definition object to the 'public'
      // object (publicPrototype), but this won't work with native `super`.
      // Maybe later, we can use a Proxy to read props from both the root
      // object and the public object, so that `super` works from both.
      // Another option is to not allow a `public` object, only protected
      // and private

      if (definition !== publicPrototype) {
        // copy whatever remains
        Object(utils["c" /* copyDescriptors */])(definition, publicPrototype);
      }
    }

    if (customClass) {
      if (staticMembers) Object(utils["c" /* copyDescriptors */])(staticMembers, customClass);
      return customClass;
    }

    const userConstructor = publicPrototype.hasOwnProperty('constructor') ? publicPrototype.constructor : null;
    let NewClass = null;
    let newPrototype = null; // ES5 version (which seems to be so much better)

    if (mode === 'es5') {
      NewClass = (() => function () {
        let ret = null;
        let constructor = null;
        if (userConstructor) constructor = userConstructor;else constructor = ParentClass; // Object is a special case because otherwise
        // `Object.apply(this)` returns a different object and we don't
        // want to deal with return value in that case

        if (constructor !== Object) ret = constructor.apply(this, arguments);

        if (ret && (typeof ret === 'object' || typeof ret === 'function')) {
          // XXX should we set ret.__proto__ = constructor.prototype
          // here? Or let the user deal with that?
          return ret;
        }

        return this;
      })();

      newPrototype = publicPrototype;
    } else {
      throw new TypeError(`
                The lowclass "mode" option can only be 'es5' for now.
            `);
    }

    if (className) {
      if (nativeNaming) {
        const code = Object(utils["d" /* getFunctionBody */])(NewClass);
        const proto = NewClass.prototype;
        NewClass = new Function(` userConstructor, ParentClass `, `
                    return function ${className}() { ${code} }
                `)(userConstructor, ParentClass);
        NewClass.prototype = proto;
      } else {
        Object(utils["k" /* setDescriptor */])(NewClass, 'name', {
          value: className
        });
      }
    }

    if (userConstructor && userConstructor.length) {
      // length is not writable, only configurable, therefore the value
      // has to be set with a descriptor update
      Object(utils["k" /* setDescriptor */])(NewClass, 'length', {
        value: userConstructor.length
      });
    } // static stuff {
    // static inheritance


    NewClass.__proto__ = ParentClass;
    if (staticMembers) Object(utils["c" /* copyDescriptors */])(staticMembers, NewClass); // allow users to make subclasses. When subclass is called on a
    // constructor, it defines `this` which is assigned to ParentClass
    // above.

    Object(utils["k" /* setDescriptor */])(NewClass, 'subclass', {
      value: Class,
      writable: true,
      enumerable: false,
      configurable: false
    }); // }
    // prototype stuff {

    NewClass.prototype = newPrototype;
    NewClass.prototype.constructor = NewClass; // }

    if (setClassDescriptors) {
      Object(utils["j" /* setDefaultStaticDescriptors */])(NewClass, options, staticBlacklist);
      Object(utils["k" /* setDescriptor */])(NewClass, 'prototype', {
        writable: prototypeWritable
      });
      Object(utils["i" /* setDefaultPrototypeDescriptors */])(NewClass.prototype, options);
      Object(utils["i" /* setDefaultPrototypeDescriptors */])(protectedPrototype, options);
      Object(utils["i" /* setDefaultPrototypeDescriptors */])(privatePrototype, options);
    }

    scope.constructor = NewClass; // convenient for debugging

    return NewClass;
  }
} // XXX PERFORMANCE: instead of doing multiple prototype traversals with
// hasPrototype in the following access helpers, maybe we can do a single
// traversal and check along the way?
//
// Worst case examples:
//
//   currently:
//     If class hierarchy has 20 classes
//     If we detect which instance we have in order of public, protected, private
//     If the instance we're checking is the private instance of the middle class (f.e. class 10)
//     We'll traverse 20 public prototypes with 20 conditional checks
//     We'll traverse 20 protected prototypes with 20 conditional checks
//     And finally we'll traverse 10 private prototypes with 10 conditional checks
//     TOTAL: We traverse over 50 prototypes with 50 conditional checks
//
//   proposed:
//     If class hierarchy has 20 classes
//     If we detect which instance we have in order of public, protected, private
//     If the instance we're checking is the private instance of the middle class (f.e. class 10)
//     We'll traverse 10 public prototypes with 3 conditional checks at each prototype
//     TOTAL: We traverse over 10 prototypes with 30 conditional checks
//     BUT: The conditional checking will involve reading WeakMaps instead of
//     checking just reference equality. If we can optimize how this part
//     works, it might be worth it.
//
// Can the tradeoff (less traversal and conditional checks) outweigh the
// heavier conditional checks?
//
// XXX PERFORMANCE: We can also cache the access-helper results, which requires more memory,
// but will make use of access helpers much faster, especially important for
// animations.

function getParentProtectedPrototype(parentPublicPrototype) {
  // look up the prototype chain until we find a parent protected prototype, if any.
  let parentProtectedProto;
  let currentPublicProto = parentPublicPrototype;

  while (currentPublicProto && !parentProtectedProto) {
    parentProtectedProto = publicProtoToProtectedProto.get(currentPublicProto);
    currentPublicProto = currentPublicProto.__proto__;
  } // TODO, now that we're finding the nearest parent protected proto,
  // we might not need to create an empty object for each class if we
  // don't find one, to avoid prototype lookup depth, as we'll connect
  // to the nearest one we find, if any.


  return parentProtectedProto || {};
}

function getParentPrivatePrototype(parentPublicPrototype) {
  // look up the prototype chain until we find a parent protected prototype, if any.
  let parentPrivateProto;
  let currentPublicProto = parentPublicPrototype;

  while (currentPublicProto && !parentPrivateProto) {
    parentPrivateProto = publicProtoToPrivateProto.get(currentPublicProto);
    currentPublicProto = currentPublicProto.__proto__;
  } // TODO, now that we're finding the nearest parent protected proto,
  // we might not need to create an empty object for each class if we
  // don't find one, to avoid prototype lookup depth, as we'll connect
  // to the nearest one we find, if any.


  return parentPrivateProto || {};
}

function getPublicMembers(scope, instance) {
  let result = scope.cachedPublicAccesses.get(instance);
  if (result) return result; // check only for the private instance of this class scope

  if (isPrivateInstance(scope, instance)) scope.cachedPublicAccesses.set(instance, result = getSubclassScope(instance).publicToPrivate.get(instance)); // check for an instance of the class (or its subclasses) of this scope
  else if (isProtectedInstance(scope, instance)) scope.cachedPublicAccesses.set(instance, result = publicToProtected.get(instance)); // otherwise just return whatever was passed in, it's public already!
    else scope.cachedPublicAccesses.set(instance, result = instance);
  return result;
}

function getProtectedMembers(scope, instance) {
  let result = scope.cachedProtectedAccesses.get(instance);
  if (result) return result; // check for an instance of the class (or its subclasses) of this scope
  // This allows for example an instance of an Animal base class to access
  // protected members of an instance of a Dog child class.

  if (isPublicInstance(scope, instance)) scope.cachedProtectedAccesses.set(instance, result = publicToProtected.get(instance) || createProtectedInstance(instance)); // check for a private instance inheriting from this class scope
  else if (isPrivateInstance(scope, instance)) {
      const publicInstance = getSubclassScope(instance).publicToPrivate.get(instance);
      scope.cachedProtectedAccesses.set(instance, result = publicToProtected.get(publicInstance) || createProtectedInstance(publicInstance));
    } // return the protected instance if it was passed in
    else if (isProtectedInstance(scope, instance)) scope.cachedProtectedAccesses.set(instance, result = instance);
  if (!result) throw new InvalidAccessError('invalid access of protected member');
  return result;
}

function getSubclassScope(privateInstance) {
  return privateInstanceToClassScope.get(privateInstance);
}

function createProtectedInstance(publicInstance) {
  // traverse instance proto chain, find first protected prototype
  const protectedPrototype = findLeafmostProtectedPrototype(publicInstance); // make the protected instance from the found protected prototype

  const protectedInstance = Object.create(protectedPrototype);
  publicToProtected.set(publicInstance, protectedInstance);
  return protectedInstance;
}

function findLeafmostProtectedPrototype(publicInstance) {
  let result = null;
  let currentProto = publicInstance.__proto__;

  while (currentProto) {
    result = publicProtoToProtectedProto.get(currentProto);
    if (result) return result;
    currentProto = currentProto.__proto__;
  }

  return result;
}

function getPrivateMembers(scope, instance) {
  let result = scope.cachedPrivateAccesses.get(instance);
  if (result) return result; // check for a public instance that is or inherits from this class

  if (isPublicInstance(scope, instance)) scope.cachedPrivateAccesses.set(instance, result = scope.publicToPrivate.get(instance) || createPrivateInstance(scope, instance)); // check for a protected instance that is or inherits from this class'
  // protectedPrototype
  else if (isProtectedInstance(scope, instance)) {
      const publicInstance = publicToProtected.get(instance);
      scope.cachedPrivateAccesses.set(instance, result = scope.publicToPrivate.get(publicInstance) || createPrivateInstance(scope, publicInstance));
    } // return the private instance if it was passed in
    else if (isPrivateInstance(scope, instance)) scope.cachedPrivateAccesses.set(instance, result = instance);
  if (!result) throw new InvalidAccessError('invalid access of private member');
  return result;
}

function createPrivateInstance(scope, publicInstance) {
  const privateInstance = Object.create(scope.privatePrototype);
  scope.publicToPrivate.set(publicInstance, privateInstance);
  privateInstanceToClassScope.set(privateInstance, scope); // TODO use WeakTwoWayMap

  return privateInstance;
}

function isPublicInstance(scope, instance, brandedCheck = true) {
  if (!brandedCheck) return Object(utils["g" /* hasPrototype */])(instance, scope.publicPrototype);

  for (const proto of Array.from(brandToPublicPrototypes.get(scope.classBrand))) {
    if (Object(utils["g" /* hasPrototype */])(instance, proto)) return true;
  }

  return false;
}

function isProtectedInstance(scope, instance, brandedCheck = true) {
  if (!brandedCheck) return Object(utils["g" /* hasPrototype */])(instance, scope.protectedPrototype);

  for (const proto of Array.from(brandToProtectedPrototypes.get(scope.classBrand))) {
    if (Object(utils["g" /* hasPrototype */])(instance, proto)) return true;
  }

  return false;
}

function isPrivateInstance(scope, instance, brandedCheck = true) {
  if (!brandedCheck) return Object(utils["g" /* hasPrototype */])(instance, scope.privatePrototype);

  for (const proto of Array.from(brandToPrivatePrototypes.get(scope.classBrand))) {
    if (Object(utils["g" /* hasPrototype */])(instance, proto)) return true;
  }

  return false;
}

function superHelper(supers, scope, instance) {
  const {
    parentPublicPrototype,
    parentProtectedPrototype,
    parentPrivatePrototype
  } = scope;
  if (isPublicInstance(scope, instance, false)) return getSuperHelperObject(instance, parentPublicPrototype, supers);
  if (isProtectedInstance(scope, instance, false)) return getSuperHelperObject(instance, parentProtectedPrototype, supers);
  if (isPrivateInstance(scope, instance, false)) return getSuperHelperObject(instance, parentPrivatePrototype, supers);
  throw new InvalidSuperAccessError('invalid super access');
}

function getSuperHelperObject(instance, parentPrototype, supers) {
  let _super = supers.get(instance); // XXX PERFORMANCE: there's probably some ways to improve speed here using caching


  if (!_super) {
    supers.set(instance, _super = Object.create(parentPrototype));
    const keys = Object(utils["f" /* getInheritedPropertyNames */])(parentPrototype);
    let i = keys.length;

    while (i--) {
      const key = keys[i];
      Object(utils["k" /* setDescriptor */])(_super, key, {
        get: function () {
          let value = void undefined;
          const descriptor = Object(utils["e" /* getInheritedDescriptor */])(parentPrototype, key);

          if (descriptor && Object(utils["h" /* propertyIsAccessor */])(descriptor)) {
            const getter = descriptor.get;
            if (getter) value = getter.call(instance);
          } else {
            value = parentPrototype[key];
          }

          if (value && value.call && typeof value === 'function') {
            value = value.bind(instance);
          }

          return value;
        },
        // like native `super`, setting a super property does nothing.
        set: function (value) {
          const descriptor = Object(utils["e" /* getInheritedDescriptor */])(parentPrototype, key);

          if (descriptor && Object(utils["h" /* propertyIsAccessor */])(descriptor)) {
            const setter = descriptor.set;
            if (setter) value = setter.call(instance, value);
          } else {
            // just like native `super`
            instance[key] = value;
          }
        }
      }, true);
    }
  }

  return _super;
}

/* harmony default export */ var src_Class = (Class_Class);
// CONCATENATED MODULE: ./src/multiple.ts
// --- TODO handle static inheritance. Nothing has been implemented with regards to
// static inheritance yet.
// --- TODO allow the subclass (f.e. the `Foo` in `class Foo extends multiple(One,
// Two, Three) {}`) to call each super constructor (One, Two, and Three)
// individually with specific arguments.
// --- TODO Prevent duplicate classes in the "prototype tree". F.e. if someone calls
// `multiple(One, Two, Three)`, and `Three` already includes `Two`, we can
// discard the `Two` argument and perform the combination as if `multiple(One,
// Three)` had been called.
// --- TODO cache the results, so more than one call to `multiple(One, Two, Three)`
// returns the same class reference as the first call.
// --- TODO, allow the user to handle the diamond problem in some way other than
// ("property or method from the first class in the list wins"). Perhaps require
// the user to specify which method to call. For now, it simply calls the first
// method in the order in which the classes were passed into multiple(). Look
// here for ideas based on how different languages handle it:
// https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem
var ImplementationMethod;

(function (ImplementationMethod) {
  ImplementationMethod["PROXIES_ON_INSTANCE_AND_PROTOTYPE"] = "PROXIES_ON_INSTANCE_AND_PROTOTYPE";
  ImplementationMethod["PROXIES_ON_PROTOTYPE"] = "PROXIES_ON_PROTOTYPE";
})(ImplementationMethod || (ImplementationMethod = {}));

function makeMultipleHelper(options) {
  /**
   * Mixes the given classes into a single class. This is useful for multiple
   * inheritance.
   *
   * @example
   * class Foo {}
   * class Bar {}
   * class Baz {}
   * class MyClass extends multiple(Foo, Bar, Baz) {}
   */
  //  ------------ method 1, define the `multiple()` signature with overrides. The
  //  upside is it is easy to understand, but the downside is that name collisions
  //  in properties cause the collided property type to be `never`. This would make
  //  it more difficult to provide solution for the diamond problem.
  //  ----------------
  // function multiple(): typeof Object
  // function multiple<T extends Constructor>(classes: T): T
  // function multiple<T extends Constructor[]>(...classes: T): Constructor<ConstructorUnionToInstanceTypeUnion<T[number]>>
  // function multiple(...classes: any): any {
  //
  //  ------------ method 2, define the signature of `multiple()` with a single
  //  signature. The upside is this picks the type of the first property
  //  encountered when property names collide amongst all the classes passed into
  //  `multiple()`, but the downside is the inner implementation may require
  //  casting, and this approach can also cause an infinite type recursion
  //  depending on the types used inside the implementation.
  //  ----------------
  return function multiple(...classes) {
    const mode = options && options.method || ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE;

    switch (mode) {
      case ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE:
        {
          return withProxiesOnThisAndPrototype(...classes);
        }

      case ImplementationMethod.PROXIES_ON_PROTOTYPE:
        {
          return withProxiesOnPrototype(...classes);
        }
    }
  };
}
/**
 * Mixes the given classes into a single class. This is useful for multiple
 * inheritance.
 *
 * @example
 * class Foo {}
 * class Bar {}
 * class Baz {}
 * class MyClass extends multiple(Foo, Bar, Baz) {}
 */

const multiple = makeMultipleHelper({
  method: ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE
}); // export const multiple = makeMultipleHelper({method: ImplementationMethod.PROXIES_ON_PROTOTYPE})

function withProxiesOnThisAndPrototype(...classes) {
  // avoid performance costs in special cases
  if (classes.length === 0) return Object;
  if (classes.length === 1) return classes[0];
  const FirstClass = classes.shift(); // inherit the first class normally. This allows for required native
  // inheritance in certain special cases (like inheriting from HTMLElement
  // when making Custom Elements).

  class MultiClass extends FirstClass {
    constructor(...args) {
      super(...args);
      const instances = []; // make instances of the other classes to get/set properties on.

      let Ctor;

      for (let i = 0, l = classes.length; i < l; i += 1) {
        Ctor = classes[i];
        const instance = Reflect.construct(Ctor, args);
        instances.push(instance);
      }

      return new Proxy(this, {
        // No `set()` trap is needed in this Proxy handler, at least for
        // the tests so far. Methods automatically have the correct
        // receiver when the are gotten with the `get()` trap, so if any
        // methods set a property, the set happens on the expected
        // instance, just like regular [[Set]].
        get(target, key, self) {
          if (Reflect.ownKeys(target).includes(key)) return Reflect.get(target, key, self);
          let instance;

          for (let i = 0, l = instances.length; i < l; i += 1) {
            instance = instances[i];
            if (Reflect.ownKeys(instance).includes(key)) return Reflect.get(instance, key, self);
          }

          const proto = Object.getPrototypeOf(self);
          if (Reflect.has(proto, key)) return Reflect.get(proto, key, self);
          return undefined;
        },

        ownKeys(target) {
          let keys = Reflect.ownKeys(target);
          let instance;
          let instanceKeys;

          for (let i = 0, l = instances.length; i < l; i += 1) {
            instance = instances[i];
            instanceKeys = Reflect.ownKeys(instance);

            for (let j = 0, l = instanceKeys.length; j < l; j += 1) keys.push(instanceKeys[j]);
          }

          return keys;
        },

        // This makes the `in` operator work, for example.
        has(target, key) {
          if (Reflect.ownKeys(target).includes(key)) return true;
          let instance;

          for (let i = 0, l = instances.length; i < l; i += 1) {
            instance = instances[i];
            if (Reflect.ownKeys(instance).includes(key)) return true;
          } // all instances share the same prototype, so just check it once


          const proto = Object.getPrototypeOf(self);
          if (Reflect.has(proto, key)) return true;
          return false;
        }

      });
    }

  }

  const newMultiClassPrototype = new Proxy(Object.create(FirstClass.prototype), {
    get(target, key, self) {
      if (Reflect.has(target, key)) return Reflect.get(target, key, self);
      let Class;

      for (let i = 0, l = classes.length; i < l; i += 1) {
        Class = classes[i];
        if (Reflect.has(Class.prototype, key)) return Reflect.get(Class.prototype, key, self);
      }
    },

    has(target, key) {
      if (Reflect.has(target, key)) return true;
      let Class;

      for (let i = 0, l = classes.length; i < l; i += 1) {
        Class = classes[i];
        if (Reflect.has(Class.prototype, key)) return true;
      }

      return false;
    }

  }); // This is so that `super` calls will work. We can't replace
  // MultiClass.prototype with a Proxy because MultiClass.prototype is
  // non-configurable, so it is impossible to wrap it with a Proxy. Instead,
  // we stick our own custom Proxy-wrapped prototype object between
  // MultiClass.prototype and FirstClass.prototype.

  Object.setPrototypeOf(MultiClass.prototype, newMultiClassPrototype);
  return MultiClass;
}

let currentSelf = [];

function withProxiesOnPrototype(...classes) {
  // avoid performance costs in special cases
  if (classes.length === 0) return Object;
  if (classes.length === 1) return classes[0];
  const FirstClass = classes.shift(); // inherit the first class normally. This allows for required native
  // inheritance in certain special cases (like inheriting from HTMLElement
  // when making Custom Elements).

  class MultiClass extends FirstClass {
    constructor(...args) {
      super(...args);
      const instances = getInstances(this); // make instances of the other classes to get/set properties on.

      for (const Ctor of classes) {
        const instance = new Ctor(...args); // const instance = Reflect.construct(Ctor, args, new.target)

        instances.push(instance);
      }
    }

  }

  const __instances__ = new WeakMap();

  const getInstances = inst => {
    let result = __instances__.get(inst);

    if (!result) __instances__.set(inst, result = []);
    return result;
  };

  const newMultiClassPrototype = new Proxy(Object.create(FirstClass.prototype), {
    get(target, key, self) {
      currentSelf.push(self); // If the key is in the current prototype chain, continue like normal...

      if (Reflect.has(target, key)) {
        currentSelf.pop();
        return Reflect.get(target, key, self);
      }

      currentSelf.pop(); // ...Otherwise if the key isn't, look it up on the instances of each class.
      // This is something like a "prototype tree".

      for (const instance of getInstances(self)) {
        currentSelf.push(instance);

        if (Reflect.has(instance, key)) {
          currentSelf.pop();
          return Reflect.get(instance, key, instance);
        }

        currentSelf.pop();
      } // If the key is not found, return undefined like normal.


      return undefined;
    },

    set(target, key, value, self) {
      currentSelf.push(self); // If the key is in the current prototype chain, continue like normal...

      if (Reflect.has(target, key)) {
        currentSelf.pop();
        return Reflect.set(target, key, value, self);
      }

      currentSelf.pop(); // ...Otherwise if the key isn't, set it on one of the instances of the classes.

      for (const instance of getInstances(self)) {
        currentSelf.push(instance);

        if (Reflect.has(instance, key)) {
          currentSelf.pop();
          return Reflect.set(instance, key, value, instance); // return Reflect.set(instance, key, value, self)
        }

        currentSelf.pop();
      } // If the key is not found, set it like normal.


      return Reflect.set(target, key, value, self);
    },

    has(target, key) {
      if (currentSelf.length) {
        let current = currentSelf[currentSelf.length - 1];

        while (current) {
          if (Reflect.ownKeys(current).includes(key)) return true;
          current = Reflect.getPrototypeOf(current);
        }

        for (const instance of getInstances(currentSelf[currentSelf.length - 1])) if (Reflect.has(instance, key)) return true;
      } else {
        if (Reflect.has(target, key)) return true;

        for (const Ctor of classes) if (Reflect.has(Ctor.prototype, key)) return true;
      }

      return false;
    }

  }); // This is so that `super` calls will work. We can't replace
  // MultiClass.prototype with a Proxy because MultiClass.prototype is
  // non-configurable, so it is impossible to wrap it with a Proxy. Instead,
  // we stick our own custom Proxy-wrapped prototype object between
  // MultiClass.prototype and FirstClass.prototype.

  Object.setPrototypeOf(MultiClass.prototype, newMultiClassPrototype);
  return MultiClass;
}
// CONCATENATED MODULE: ./src/Mixin.ts
function Mixin_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { Mixin_defineProperty(target, key, source[key]); }); } return target; }

function Mixin_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO no any types
// TODO no @ts-ignore

function Mixin(mixinFn, DefaultBase) {
  // XXX Maybe Cached should go last.
  // @ts-ignore
  mixinFn = Cached(mixinFn);
  mixinFn = HasInstance(mixinFn);
  mixinFn = Dedupe(mixinFn);
  mixinFn = WithDefault(mixinFn, DefaultBase || src_Class());
  mixinFn = ApplyDefault(mixinFn); // @ts-ignore

  return mixinFn();
}
/* harmony default export */ var src_Mixin = (Mixin);
 // TODO remove WithDefault, we can use default argument syntax instead, which is more clear and conventional

function WithDefault(classFactory, Default) {
  // @ts-ignore
  return named(classFactory.name, Base => {
    Base = Base || Default;
    return classFactory(Base);
  });
}

function Cached(classFactory) {
  const classCache = new WeakMap(); // @ts-ignore

  return named(classFactory.name, Base => {
    let Class = classCache.get(Base);

    if (!Class) {
      classCache.set(Base, Class = classFactory(Base));
    }

    return Class;
  });
}

function HasInstance(classFactory) {
  let instanceofSymbol; // @ts-ignore

  return named(classFactory.name, Base => {
    const Class = classFactory(Base);
    if (typeof Symbol === 'undefined' || !Symbol.hasInstance) return Class;
    if (Object.getOwnPropertySymbols(Class).includes(Symbol.hasInstance)) return Class;
    if (!instanceofSymbol) instanceofSymbol = Symbol('instanceofSymbol');
    Class[instanceofSymbol] = true;
    Object.defineProperty(Class, Symbol.hasInstance, {
      value: function hasInstance(obj) {
        // we do this check because a subclass of `Class` may not have
        // it's own `[Symbol.hasInstance]()` method, therefore `this`
        // will be the subclass, not this `Class`, when the prototype
        // lookup on the subclass finds the `[Symbol.hasInstance]()`
        // method of this `Class`. In this case, we don't want to run
        // our logic here, so we delegate to the super class of this
        // `Class` to take over with the instanceof check. In many
        // cases, the super class `[Symbol.hasInstance]()` method will
        // be `Function.prototype[Symbol.hasInstance]` which will
        // perform the standard check.
        if (this !== Class) // This is effectively a `super` call.
          return Class.__proto__[Symbol.hasInstance].call(this, obj);
        let currentProto = obj;

        while (currentProto) {
          const descriptor = Object.getOwnPropertyDescriptor(currentProto, 'constructor');
          if (descriptor && descriptor.value && descriptor.value.hasOwnProperty(instanceofSymbol)) return true;
          currentProto = currentProto.__proto__;
        }

        return false;
      }
    });
    return Class;
  });
} // requires WithDefault or a classFactory that can accept no args


function ApplyDefault(classFactory) {
  const DefaultClass = classFactory();
  DefaultClass.mixin = classFactory;
  return classFactory;
} // requires Cached


function Dedupe(classFactory) {
  const map = new WeakMap(); // @ts-ignore

  return named(classFactory.name, Base => {
    if (hasMixin(Base, classFactory, map)) return Base;
    const Class = classFactory(Base);
    map.set(Class, classFactory);
    return Class;
  });
}

function hasMixin(Class, mixin, map) {
  while (Class) {
    if (map.get(Class) === mixin) return true;
    Class = Class.__proto__;
  }

  return false;
}

function named(name, func) {
  try {
    Object.defineProperty(func, 'name', Mixin_objectSpread({}, Object.getOwnPropertyDescriptor(func, 'name'), {
      value: name
    }));
  } catch (e) {// do nohing in case the property is non-configurable.
  }

  return func;
}
// CONCATENATED MODULE: ./src/instanceOf.ts
// helper function to use instead of instanceof for classes that implement the
// static Symbol.hasInstance method, because the behavior of instanceof isn't
// polyfillable.
function instanceOf(instance, Constructor) {
  if (typeof Constructor == 'function' && Constructor[Symbol.hasInstance]) return Constructor[Symbol.hasInstance](instance);else return instance instanceof Constructor;
}
// EXTERNAL MODULE: ./src/native.ts
var src_native = __webpack_require__(1);

// CONCATENATED MODULE: ./src/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* concated harmony reexport staticBlacklist */__webpack_require__.d(__webpack_exports__, "staticBlacklist", function() { return staticBlacklist; });
/* concated harmony reexport InvalidSuperAccessError */__webpack_require__.d(__webpack_exports__, "InvalidSuperAccessError", function() { return InvalidSuperAccessError; });
/* concated harmony reexport InvalidAccessError */__webpack_require__.d(__webpack_exports__, "InvalidAccessError", function() { return InvalidAccessError; });
/* concated harmony reexport Class */__webpack_require__.d(__webpack_exports__, "Class", function() { return Class_Class; });
/* concated harmony reexport createClassHelper */__webpack_require__.d(__webpack_exports__, "createClassHelper", function() { return createClassHelper; });
/* concated harmony reexport makeMultipleHelper */__webpack_require__.d(__webpack_exports__, "makeMultipleHelper", function() { return makeMultipleHelper; });
/* concated harmony reexport multiple */__webpack_require__.d(__webpack_exports__, "multiple", function() { return multiple; });
/* concated harmony reexport Mixin */__webpack_require__.d(__webpack_exports__, "Mixin", function() { return Mixin; });
/* concated harmony reexport WithDefault */__webpack_require__.d(__webpack_exports__, "WithDefault", function() { return WithDefault; });
/* concated harmony reexport Cached */__webpack_require__.d(__webpack_exports__, "Cached", function() { return Cached; });
/* concated harmony reexport HasInstance */__webpack_require__.d(__webpack_exports__, "HasInstance", function() { return HasInstance; });
/* concated harmony reexport ApplyDefault */__webpack_require__.d(__webpack_exports__, "ApplyDefault", function() { return ApplyDefault; });
/* concated harmony reexport Dedupe */__webpack_require__.d(__webpack_exports__, "Dedupe", function() { return Dedupe; });
/* concated harmony reexport instanceOf */__webpack_require__.d(__webpack_exports__, "instanceOf", function() { return instanceOf; });
/* concated harmony reexport native */__webpack_require__.d(__webpack_exports__, "native", function() { return src_native["a" /* native */]; });
/* concated harmony reexport WeakTwoWayMap */__webpack_require__.d(__webpack_exports__, "WeakTwoWayMap", function() { return utils["b" /* WeakTwoWayMap */]; });
/* concated harmony reexport getFunctionBody */__webpack_require__.d(__webpack_exports__, "getFunctionBody", function() { return utils["d" /* getFunctionBody */]; });
/* concated harmony reexport setDescriptor */__webpack_require__.d(__webpack_exports__, "setDescriptor", function() { return utils["k" /* setDescriptor */]; });
/* concated harmony reexport setDescriptors */__webpack_require__.d(__webpack_exports__, "setDescriptors", function() { return utils["l" /* setDescriptors */]; });
/* concated harmony reexport propertyIsAccessor */__webpack_require__.d(__webpack_exports__, "propertyIsAccessor", function() { return utils["h" /* propertyIsAccessor */]; });
/* concated harmony reexport getInheritedDescriptor */__webpack_require__.d(__webpack_exports__, "getInheritedDescriptor", function() { return utils["e" /* getInheritedDescriptor */]; });
/* concated harmony reexport getInheritedPropertyNames */__webpack_require__.d(__webpack_exports__, "getInheritedPropertyNames", function() { return utils["f" /* getInheritedPropertyNames */]; });
/* concated harmony reexport Constructor */__webpack_require__.d(__webpack_exports__, "Constructor", function() { return utils["a" /* Constructor */]; });
/* concated harmony reexport hasPrototype */__webpack_require__.d(__webpack_exports__, "hasPrototype", function() { return utils["g" /* hasPrototype */]; });
/* concated harmony reexport copyDescriptors */__webpack_require__.d(__webpack_exports__, "copyDescriptors", function() { return utils["c" /* copyDescriptors */]; });
/* concated harmony reexport setDefaultPrototypeDescriptors */__webpack_require__.d(__webpack_exports__, "setDefaultPrototypeDescriptors", function() { return utils["i" /* setDefaultPrototypeDescriptors */]; });
/* concated harmony reexport setDefaultStaticDescriptors */__webpack_require__.d(__webpack_exports__, "setDefaultStaticDescriptors", function() { return utils["j" /* setDefaultStaticDescriptors */]; });
// the bread and butter


/* harmony default export */ var src = __webpack_exports__["default"] = (src_Class); // mix and match your classes!


 // extras




const version = '4.8.0';

/***/ })
/******/ ]);
//# sourceMappingURL=global.js.map