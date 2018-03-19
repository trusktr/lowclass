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

    const publicPrototype = Object.create(ParentClass.prototype)
    const parentProtected = publicPrototypeToProtectedPrototypeMap.get(ParentClass.prototype) || {}
    const protectedPrototype = Object.create(parentProtected)
    function dummyProtectedCtor() {}
    dummyProtectedCtor.prototype = protectedPrototype
    const privatePrototype = {}

    const publicInstanceToPrivateInstanceMap = new WeakMap

    const scope = {}

    const _getProtectedMembers = getProtectedMembers.bind( null, scope )
    const _getPrivateMembers = getPrivateMembers.bind( null, scope )

    const def = definerFunction( publicPrototype, _getProtectedMembers, _getPrivateMembers)

    copyDescriptors(_getProtectedMembers, protectedPrototype)
    copyDescriptors(_getPrivateMembers, privatePrototype)

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

    const NewClass = new Function('originalConstructor', `
        return function ${className}() {
            return originalConstructor.apply(this, arguments)
        }
    `)(originalConstructor)

    // so that the get*Members functions can access these.
    scope.NewClass = NewClass
    scope.dummyProtectedCtor = dummyProtectedCtor
    scope.privatePrototype = privatePrototype
    scope.protectedPrototype = protectedPrototype
    scope.publicInstanceToPrivateInstanceMap = publicInstanceToPrivateInstanceMap

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

function getProtectedMembers( scope, instance) {
    if (!(
        instance instanceof scope.NewClass ||
        instance instanceof scope.dummyProtectedCtor ||
        Object.getPrototypeOf(instance) === scope.privatePrototype // would instance.constructor.prototype be faster here?
    )) {
        throw new InvalidAccessError('Invalid access of protected member.')
    }

    if (Object.getPrototypeOf(instance) === scope.privatePrototype) {
        return getProtectedMembers( scope, privateInstanceToPublicInstanceMap.get(instance))
    }

    let currentPublicPrototype
    if (instance instanceof scope.NewClass) {
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

function getPrivateMembers( scope, instance) {
    if (!(
        instance instanceof scope.NewClass ||
        instance instanceof scope.dummyProtectedCtor ||
        Object.getPrototypeOf(instance) === scope.privatePrototype
    )) {
        throw new InvalidAccessError('Invalid access of private member.')
    }

    if (Object.getPrototypeOf(instance) === scope.protectedPrototype) {
        return getPrivateMembers( scope, protectedInstanceToPublicInstanceMap.get(instance) )
    }

    let privateInstance = scope.publicInstanceToPrivateInstanceMap.get(instance)
    let publicInstance = privateInstanceToPublicInstanceMap.get(instance)

    if (!privateInstance && !publicInstance) {
        privateInstance = Object.create(scope.privatePrototype)
        scope.publicInstanceToPrivateInstanceMap.set(instance, privateInstance)
        privateInstanceToPublicInstanceMap.set(privateInstance, instance)
    }

    if (!privateInstance && publicInstance) {
        return publicInstance
    }
    else if (privateInstance && !publicInstance) {
        return privateInstance
    }

    return privateInstance
}

module.exports = Class
module.exports.InvalidAccessError = InvalidAccessError
