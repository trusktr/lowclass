const publicPrototypeToProtectedPrototypeMap = new WeakMap
const protectedPrototypeToPublicPrototypeMap = new WeakMap
const privatePrototypeToPublicPrototypeMap = new WeakMap

const publicInstanceToProtectedInstanceMap = new WeakMap
const protectedInstanceToPublicInstanceMap = new WeakMap
const privateInstanceToPublicInstanceMap = new WeakMap

class InvalidAccessError extends Error {}

/**
 * @param {string} definerFunction Function for defining a class...
 */
function Class(className, definerFunction) {
    "use strict"

    if (typeof className == 'function' && !definerFunction) {
        definerFunction = className
        className = definerFunction.name || ''
    }

    if (typeof className != 'string')
        throw new TypeError(`If supplying two arguments, you must specify a string for the first 'className' argument. If supplying only one argument, it must be a named function.`)

    if (typeof definerFunction != 'function')
        throw new TypeError('If supplying two arguments, you must specify a function for the second `definerFunction` argument. If supplying only one argument, it must be a named function.')

    const ParentClass = this || Object

    function getProtectedMembers(instance) {
        if (!(
            instance instanceof NewClass ||
            instance instanceof dummyProtectedCtor ||
            Object.getPrototypeOf(instance) === privatePrototype // would instance.constructor.prototype be faster here?
        )) {
            throw new InvalidAccessError('Invalid access of protected member.')
        }

        if (Object.getPrototypeOf(instance) === privatePrototype) {
            return getProtectedMembers(privateInstanceToPublicInstanceMap.get(instance))
        }

        let currentPublicPrototype
        if (instance instanceof NewClass) {
            currentPublicPrototype = instance.constructor.prototype // TODO use getPrototypeOf
        }
        else {
            currentPublicPrototype = protectedPrototypeToPublicPrototypeMap.get(Object.getPrototypeOf(instance))
        }

        const currentProtectedPrototype = publicPrototypeToProtectedPrototypeMap.get(currentPublicPrototype)
        let protectedInstance = publicInstanceToProtectedInstanceMap.get(instance)
        let publicInstance = protectedInstanceToPublicInstanceMap.get(instance)

        if (!protectedInstance && !publicInstance) {
            protectedInstance = Object.create(currentProtectedPrototype)
            publicInstanceToProtectedInstanceMap.set(instance, protectedInstance)
            protectedInstanceToPublicInstanceMap.set(protectedInstance, instance)
        }

        if (!protectedInstance && publicInstance) {
            return publicInstance
        }
        else if (protectedInstance && !publicInstance) {
            return protectedInstance
        }

        return protectedInstance
    }

    const publicPrototype = Object.create(ParentClass.prototype)
    const parentProtected = publicPrototypeToProtectedPrototypeMap.get(ParentClass.prototype) || {}
    const protectedPrototype = Object.create(parentProtected)
    function dummyProtectedCtor() {}
    dummyProtectedCtor.prototype = protectedPrototype
    const privatePrototype = {}

    const publicInstanceToPrivateInstanceMap = new WeakMap
    function getPrivateMembers(instance) {
        if (!(
            instance instanceof NewClass ||
            instance instanceof dummyProtectedCtor ||
            Object.getPrototypeOf(instance) === privatePrototype
        )) {
            throw new InvalidAccessError('Invalid access of private member.')
        }

        if (Object.getPrototypeOf(instance) === protectedPrototype) {
            return getPrivateMembers(protectedInstanceToPublicInstanceMap.get(instance))
        }

        let privates = publicInstanceToPrivateInstanceMap.get(instance)
        let publicInstance = privateInstanceToPublicInstanceMap.get(instance)

        if (!privates && !publicInstance) {
            privates = Object.create(privatePrototype)
            publicInstanceToPrivateInstanceMap.set(instance, privates)
            privateInstanceToPublicInstanceMap.set(privates, instance)
        }

        if (!privates && publicInstance) {
            return publicInstance
        }
        else if (privates && !publicInstance) {
            return privates
        }

        return privates
    }

    const def = definerFunction(publicPrototype, getProtectedMembers, getPrivateMembers)

    copyDescriptors(getProtectedMembers, protectedPrototype)
    copyDescriptors(getPrivateMembers, privatePrototype)

    if (typeof def == 'object') {
        if (typeof def.public == 'object') copyDescriptors(def.public, publicPrototype)
        if (typeof def.protected == 'object') copyDescriptors(def.protected, protectedPrototype)
        if (typeof def.private == 'object') copyDescriptors(def.private, privatePrototype)
        delete def.public
        delete def.protected
        delete def.private
        copyDescriptors(def, publicPrototype)
    }

    if (!publicPrototype.hasOwnProperty('constructor')) {
        publicPrototype.constructor = new Function('ParentClass', `
            return function ${className}() {
                ParentClass.apply(this, arguments)
            }
        `)(ParentClass)
    }

    const originalConstructor = publicPrototype.constructor

    // `var` here, so that it is hoisted
    var NewClass = new Function('originalConstructor', `
        return function ${className}() {
            return originalConstructor.apply(this, arguments)
        }
    `)(originalConstructor)

    NewClass.subclass = Class
    NewClass.prototype = publicPrototype

    // TODO: make non-writable and non-configurable like ES6+
    NewClass.prototype.constructor = NewClass

    publicPrototypeToProtectedPrototypeMap.set(publicPrototype, protectedPrototype)
    protectedPrototypeToPublicPrototypeMap.set(protectedPrototype, publicPrototype)
    privatePrototypeToPublicPrototypeMap.set(privatePrototype, publicPrototype)

    return NewClass
}

function copyDescriptors(source, destination) {
    const props = Object.keys(source)
    let i = props.length
    while (i--) {
        const prop = props[i]
        const descriptor = Object.getOwnPropertyDescriptor(source, prop)
        Object.defineProperty(destination, prop, descriptor)
    }
}

module.exports = Class
module.exports.InvalidAccessError = InvalidAccessError
