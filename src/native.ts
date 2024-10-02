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

import {getFunctionBody, setDescriptor} from './utils.js'
import {Constructor} from './Constructor.js'

export {newless as native}

export default newless

var supportsSpread = isSyntaxSupported('Object(...[{}])')
var supportsClass = isSyntaxSupported('class Test {}')
var supportsNewTarget = isSyntaxSupported('new.target')

// Used to track the original wrapped constructor on a newless instance
var TRUE_CONSTRUCTOR = Symbol ? Symbol('trueConstructor') : '__newlessTrueConstructor__'

var setPrototype =
	Object.setPrototypeOf ||
	function setPrototypeOf(object, newPrototype) {
		object.__proto__ = newPrototype
	}

// Polyfill for Reflect.construct
var construct =
	(Reflect && Reflect.construct) ||
	(function () {
		if (supportsClass) {
			return Function(
				'constructor, args, target',
				`
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
                ${
					supportsSpread
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

                `
				}

                // fix up the prototype so it matches the intended one, not one who's
                // prototype is the intended one :P
                Object.setPrototypeOf(value, target.prototype);
                return value;
            `,
			)

			//return Function("constructor, args, newTarget", `
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
			var instantiator = function () {} as any
			return function construct(constructor: any, args: any, target: any) {
				if (arguments.length === 3 && typeof target !== 'function')
					throw new TypeError(target + ' is not a constructor')
				instantiator.prototype = (target || constructor).prototype
				var instance = new instantiator()
				var value = constructor.apply(instance, args)
				if (typeof value === 'object' && value) {
					// we can do better if __proto__ is available (in some ES5 environments)
					value.__proto__ = (target || constructor).prototype
					return value
				}
				return instance
			}
		}
	})()

// ES2015 class methods are non-enumerable; we need a helper for copying them.
var SKIP_PROPERTIES: (string | symbol)[] = ['arguments', 'caller', 'length', 'name', 'prototype']
function copyProperties(source: any, destination: any) {
	if (Object.getOwnPropertyNames && Object.defineProperty) {
		var properties: (string | symbol)[] = Object.getOwnPropertyNames(source)
		if (Object.getOwnPropertySymbols) {
			properties = properties.concat(Object.getOwnPropertySymbols(source))
		}
		for (var i = properties.length - 1; i >= 0; i--) {
			if (SKIP_PROPERTIES.indexOf(properties[i]!) === -1) {
				Object.defineProperty(
					destination,
					properties[i]!,
					Object.getOwnPropertyDescriptor(source, properties[i]!)!,
				)
			}
		}
	} else {
		for (var property in source) {
			destination[property] = source[property]
		}
	}
}

type FuncLikeCtor<T, S = {}> = {
	(): T
	new (): T
} & S

function newless<T extends Constructor>(constructor: T): FuncLikeCtor<InstanceType<T>, T> {
	var name = constructor.name

	// V8 and newer versions of JSCore return the full class declaration from
	// `toString()`, which lets us be a little smarter and more performant
	// about what to do, since we know we are dealing with a "class". Note,
	// however, not all engines do this. This could be false and the constructor
	// might still use class syntax.
	var usesClassSyntax = constructor.toString().substr(0, 5) === 'class'

	var requiresNew = usesClassSyntax ? true : null

	var newlessConstructor: CtorWithLength = (() =>
		function (this: any) {
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
					const returnValue = constructor.apply(this, arguments as any)
					return (typeof returnValue === 'object' && returnValue) || this
				}
				try {
					requiresNew = false
					const returnValue = constructor.apply(this, arguments as any)
					return (typeof returnValue === 'object' && returnValue) || this
				} catch (error) {
					// Do our best to only capture errors triggred by class syntax.
					// Unfortunately, there's no special error type for this and the
					// message is non-standard, so this is the best check we can do.
					if (
						error instanceof TypeError &&
						(/class constructor/i.test(error.message) || /use the 'new' operator/i.test(error.message)) // Custom Elements in Chrome
						// TODO: there might be other error messages we need to catch,
						// depending on engine and use case. We need to test in all browsers
					) {
						// mark this constructor as requiring 'new' for next time
						requiresNew = true
					} else {
						if (
							error instanceof Error &&
							/Illegal constructor/i.test(error.message) &&
							Object.create(constructor.prototype) instanceof Node
						) {
							console.error(
								`The following error can happen if a Custom Element is called
with 'new' before being defined. The constructor was ${constructor.name}: `,
								constructor,
							)
						}

						throw error
					}
				}
			}
			// make a reasonably good replacement for 'new.target' which is a
			// syntax error in older engines
			var newTarget
			var hasNewTarget = false
			if (supportsNewTarget) {
				eval('newTarget = new.target')
				if (newTarget) hasNewTarget = true
			}
			if (!supportsNewTarget || !hasNewTarget) {
				newTarget = this instanceof newlessConstructor ? this.constructor : constructor
			}
			const returnValue = construct(constructor, arguments, newTarget)
			// best effort to make things easy for functions inheriting from classes
			if (this instanceof newlessConstructor) {
				setPrototype(this, returnValue)
			}
			return returnValue
		})() as unknown as CtorWithLength

	if (name) {
		const code = getFunctionBody(newlessConstructor)

		newlessConstructor = Function(
			'constructor, construct, setPrototype, requiresNew, supportsNewTarget',
			`
      var newlessConstructor = function ${name}() { ${code} };
      return newlessConstructor
    `,
		)(constructor, construct, setPrototype, requiresNew, supportsNewTarget)
	}

	// copy the `.length` value to the newless constructor
	if (constructor.length) {
		// length is not writable, only configurable, therefore the value
		// has to be set with a descriptor update
		setDescriptor(newlessConstructor, 'length', {
			value: constructor.length,
		})
	}

	newlessConstructor.prototype = Object.create(constructor.prototype)
	newlessConstructor.prototype.constructor = newlessConstructor

	// NOTE: *usually* the below will already be true, but we ensure it here.
	// Safari 9 requires this for the 'super' keyword to work. Newer versions
	// of WebKit and other engines do not. Instead, they use the constructor's
	// prototype chain (which is correct by ES2015 spec) (see below).
	constructor.prototype.constructor = constructor

	// for ES2015 classes, we need to make sure the constructor's prototype
	// is the super class's constructor. Further, optimize performance by
	// pointing at the actual constructor implementation instead of the
	// newless wrapper (in the case that it is wrapped by newless).
	;(newlessConstructor as any)[TRUE_CONSTRUCTOR] = constructor

	copyProperties(constructor, newlessConstructor)
	setPrototype(newlessConstructor, constructor)

	return newlessConstructor as FuncLikeCtor<InstanceType<T>, T>
}

// Test whether a given syntax is supported
function isSyntaxSupported(example: string, useStrict = true): boolean {
	try {
		return !!Function('', (useStrict ? "'use strict';" : '') + example)
	} catch (error) {
		return false
	}
}

type CtorWithLength = Constructor<
	object,
	any[],
	{
		length: number
	}
>
