import { getFunctionBody, setDescriptor } from './utils.js';
export { newless as native };
export default newless;
var supportsSpread = isSyntaxSupported('Object(...[{}])');
var supportsClass = isSyntaxSupported('class Test {}');
var supportsNewTarget = isSyntaxSupported('new.target');
var TRUE_CONSTRUCTOR = Symbol ? Symbol('trueConstructor') : '__newlessTrueConstructor__';
var setPrototype = Object.setPrototypeOf ||
    function setPrototypeOf(object, newPrototype) {
        object.__proto__ = newPrototype;
    };
var construct = (Reflect && Reflect.construct) ||
    (function () {
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
                ${supportsSpread
                ? `

                    var value = new instantiator(...([].slice.call(args)));

                `
                : `

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
            `);
        }
        else {
            var instantiator = function () { };
            return function construct(constructor, args, target) {
                if (arguments.length === 3 && typeof target !== 'function')
                    throw new TypeError(target + ' is not a constructor');
                instantiator.prototype = (target || constructor).prototype;
                var instance = new instantiator();
                var value = constructor.apply(instance, args);
                if (typeof value === 'object' && value) {
                    value.__proto__ = (target || constructor).prototype;
                    return value;
                }
                return instance;
            };
        }
    })();
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
    }
    else {
        for (var property in source) {
            destination[property] = source[property];
        }
    }
}
function newless(constructor) {
    var name = constructor.name;
    var usesClassSyntax = constructor.toString().substr(0, 5) === 'class';
    var requiresNew = usesClassSyntax ? true : null;
    var newlessConstructor = (() => function () {
        if (!requiresNew && this instanceof newlessConstructor) {
            if (requiresNew === false) {
                const returnValue = constructor.apply(this, arguments);
                return (typeof returnValue === 'object' && returnValue) || this;
            }
            try {
                requiresNew = false;
                const returnValue = constructor.apply(this, arguments);
                return (typeof returnValue === 'object' && returnValue) || this;
            }
            catch (error) {
                if (error instanceof TypeError &&
                    (/class constructor/i.test(error.message) || /use the 'new' operator/i.test(error.message))) {
                    requiresNew = true;
                }
                else {
                    if (error instanceof Error &&
                        /Illegal constructor/i.test(error.message) &&
                        Object.create(constructor.prototype) instanceof Node) {
                        console.error(`The following error can happen if a Custom Element is called
with 'new' before being defined. The constructor was ${constructor.name}: `, constructor);
                    }
                    throw error;
                }
            }
        }
        var newTarget;
        var hasNewTarget = false;
        if (supportsNewTarget) {
            eval('newTarget = new.target');
            if (newTarget)
                hasNewTarget = true;
        }
        if (!supportsNewTarget || !hasNewTarget) {
            newTarget = this instanceof newlessConstructor ? this.constructor : constructor;
        }
        const returnValue = construct(constructor, arguments, newTarget);
        if (this instanceof newlessConstructor) {
            setPrototype(this, returnValue);
        }
        return returnValue;
    })();
    if (name) {
        const code = getFunctionBody(newlessConstructor);
        newlessConstructor = Function('constructor, construct, setPrototype, requiresNew, supportsNewTarget', `
      var newlessConstructor = function ${name}() { ${code} };
      return newlessConstructor
    `)(constructor, construct, setPrototype, requiresNew, supportsNewTarget);
    }
    if (constructor.length) {
        setDescriptor(newlessConstructor, 'length', {
            value: constructor.length,
        });
    }
    newlessConstructor.prototype = Object.create(constructor.prototype);
    newlessConstructor.prototype.constructor = newlessConstructor;
    constructor.prototype.constructor = constructor;
    newlessConstructor[TRUE_CONSTRUCTOR] = constructor;
    copyProperties(constructor, newlessConstructor);
    setPrototype(newlessConstructor, constructor);
    return newlessConstructor;
}
function isSyntaxSupported(example, useStrict = true) {
    try {
        return !!Function('', (useStrict ? "'use strict';" : '') + example);
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=native.js.map