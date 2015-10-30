/**
 * ClassBody is an object literal that you can pass into `Class()` (when making
 * classes that don't extend anything) or `Class().extend()` when extending
 * classes.
 *
 * @typedef {ClassBody}
 * @property {Function} constructor The constructor to use for your class. It
 * can be set on the `constructor` property, or ona property matching the name
 * of your class. If none of those are set, then a default constructor will be
 * made for you a la ES6 (it calls super() for you).
 */

// Holds the name of the new class being created whenever Class is called, in order for extend() to use it.
let className = ''

/**
 * Creates a new class that extends parentClass. The new class will have the
 * properties and methods defined in body. Of the body has a constructor
 * property, then that becomes the constructor for the class, otherwise a
 * default constructor is created similarly to ES6 classes.
 *
 * @param {Function} parentClass The class that the new class will extend from.
 * @param {ClassBody} body The body that will be the properties and methods of the new class.
 * @return {Function} The new class constructor function.
 */
function extend(parentClass, body) {
    // set a default constructor if one wasn't supplied, similar to ES6
    // classes. Default constructors in ES6 call super() automatically.
    if (!body.hasOwnProperty('constructor')) {
        if (body[className]) {
            body.constructor = body[className]
            delete body[className]
        }
        else {
            // Here we create the default named constructor.  Note that errors
            // in this constructor might be hard to debug since the definition
            // will appear in a random VMXXXX in Chrome Inspector's Sources
            // tab.
            body.constructor = new Function('parentClass', `
                return function ${className}() {
                    parentClass.apply(this, arguments)
                }
            `)(parentClass)
            //body.constructor = function() { parentClass.apply(this, arguments) }
        }
    }

    // keep a ref to the new class' constructor.
    let newClass = body.constructor

    // the new class extends the parentClass
    newClass.prototype = Object.create(parentClass.prototype)
    newClass.prototype.constructor = newClass

    // Set the super helper. This lets us do, f.e.:
    //
    // ```
    // this.super().apply(this, arguments)
    // ```
    //
    // or
    //
    // ```
    // this.super().someMethod.apply(this, arguments)
    // ```
    //
    // without having to import the super class.
    //
    // TODO: Should we copy getters and setters? Reading and writing those
    // might cause unexpected behavior.
    if (Class.useSuperHelper) {
        //newClass.prototype.super = parentClass
        function superHelper() {
            return superHelper.caller.ownerClass
        }
        newClass.prototype.super = superHelper
        // XXX: use getOwnPropertyNames instead? The super helper might need it
        // in order to work with non-enumerable properties.
        let keys = Object.keys(parentClass.prototype)
        let i = keys.length
        while (i--) { // This iteration on Object.keys is faster than all others by a ton (f.e. way faster than for..in), see https://gist.github.com/trusktr/d7e7a9d1161dd5a7971e.
            let descriptor = Object.getOwnPropertyDescriptor(parentClass.prototype, keys[i])
            Object.defineProperty(parentClass, keys[i], descriptor)

            if (descriptor.value instanceof Function)
                descriptor.value.ownerClass = parentClass
        }
    }

    // apply all the properties and methods from the new class'
    // body to the constructor's prototype. Remove the reference to
    // the constructor from the body so we don't have to check for
    // it in the iteration, for performance.
    delete body.constructor
    let keys = Object.keys(body)
    let i = keys.length
    while (i--) { // for..in is faster than a vanilla loop on Object.getOwnPropertyNames(body)
        let descriptor = Object.getOwnPropertyDescriptor(body, keys[i])
        Object.defineProperty(newClass.prototype, keys[i], descriptor)
    }

    return newClass
}

/**
 * @param {string} name The name of the class you are creating.
 * @param {ClassBody} body An object containing the properties and method of your
 * class. They'll be assigned to the class' prototype.
 */
function Class(name, body) {
    className = name || ''

    if (!body) // Supplying no body means a .extends() call will be chained.
        return { extends: extend }
    else if (body) // supplying a body means we're defining a new class, extending Object by default.
        return extend(Object, body)
}

// Don't use the super helper by default. Note, it only works in non-strict modes.
Class.useSuperHelper = false

module.exports = Class
