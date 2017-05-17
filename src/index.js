const publicProtoProtectedProtoMap = new WeakMap
const protectedProtoPublicProtoMap = new WeakMap
const privateProtoPublicProtoMap = new WeakMap

const instanceProtectedMap = new WeakMap
const protectedInstancePublicInstanceMap = new WeakMap
const privateInstancePublicInstanceMap = new WeakMap

/**
 * @param {string} definer Function for defining a class...
 */
function Class(className, definer) {
    "use strict"

    if (typeof className == 'function' && !definer) {
        definer = className
        className = definer.name || ''
    }
    else if (typeof className != 'string' || typeof definer != 'function')
        throw new Error('Invalid args.')

    if (!definer || typeof definer != 'function')
        throw new Error('You must specify a definer function.')

    const ParentClass = this || Object

    if (typeof ParentClass != 'function')
        throw new Error('Invalid parent class.')

    function protectedGetter(instance) {
        if (!(
            instance instanceof NewClass ||
            instance instanceof dummyProtectedCtor ||
            Object.getPrototypeOf(instance) === privatePrototype
        )) {
            throw new Error('Invalid access of protected member.')
        }

        if (Object.getPrototypeOf(instance) === privatePrototype) {
            return protectedGetter(privateInstancePublicInstanceMap.get(instance))
        }

        let currentPublicPrototype
        if (instance instanceof NewClass) {
            currentPublicPrototype = instance.constructor.prototype // TODO use getPrototypeOf
        }
        else {
            currentPublicPrototype = protectedProtoPublicProtoMap.get(Object.getPrototypeOf(instance))
        }

        const currentProtectedPrototype = publicProtoProtectedProtoMap.get(currentPublicPrototype)
        let _protected = instanceProtectedMap.get(instance)
        let publics = protectedInstancePublicInstanceMap.get(instance)

        if (!_protected && !publics) {
            _protected = Object.create(currentProtectedPrototype)
            instanceProtectedMap.set(instance, _protected)
            protectedInstancePublicInstanceMap.set(_protected, instance)
        }

        if (!_protected && publics) {
            return publics
        }
        else if (_protected && !publics) {
            return _protected
        }

        return _protected
    }

    const publicPrototype = Object.create(ParentClass.prototype)
    const parentProtected = publicProtoProtectedProtoMap.get(ParentClass.prototype) || {}
    const protectedPrototype = Object.create(parentProtected)
    function dummyProtectedCtor() {}
    dummyProtectedCtor.prototype = protectedPrototype
    const privatePrototype = {}

    const instancePrivatesMap = new WeakMap
    function privatesGetter(instance) {
        if (!(
            instance instanceof NewClass ||
            instance instanceof dummyProtectedCtor ||
            Object.getPrototypeOf(instance) === privatePrototype
        )) {
            throw new Error('Invalid access of private member.')
        }

        if (Object.getPrototypeOf(instance) === protectedPrototype) {
            return privatesGetter(protectedInstancePublicInstanceMap.get(instance))
        }

        let privates = instancePrivatesMap.get(instance)
        let publics = privateInstancePublicInstanceMap.get(instance)

        if (!privates && !publics) {
            privates = Object.create(privatePrototype)
            instancePrivatesMap.set(instance, privates)
            privateInstancePublicInstanceMap.set(privates, instance)
        }

        if (!privates && publics) {
            return publics
        }
        else if (privates && !publics) {
            return privates
        }

        return privates
    }

    const def = definer(publicPrototype, protectedGetter, privatesGetter)

    copyDescriptors(protectedGetter, protectedPrototype)
    copyDescriptors(privatesGetter, privatePrototype)

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

    var NewClass = new Function('originalConstructor', `
        return function ${className}() {
            return originalConstructor.apply(this, arguments)
        }
    `)(originalConstructor)

    NewClass.subclass = Class
    NewClass.prototype = publicPrototype

    // TODO: make non-writable and non-configurable like ES6
    NewClass.prototype.constructor = NewClass

    publicProtoProtectedProtoMap.set(publicPrototype, protectedPrototype)
    protectedProtoPublicProtoMap.set(protectedPrototype, publicPrototype)
    privateProtoPublicProtoMap.set(privatePrototype, publicPrototype)

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
