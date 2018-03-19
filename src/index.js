const publicPrototypeToProtectedPrototypeMap = new WeakMap

const publicInstanceToProtectedInstanceMap = new WeakMap

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

    // extend the parent class
    const publicPrototype = Object.create(ParentClass.prototype)

    // extend the parent protected prototype
    const parentProtectedPrototype = publicPrototypeToProtectedPrototypeMap.get(ParentClass.prototype) || {}
    const protectedPrototype = Object.create(parentProtectedPrototype)

    publicPrototypeToProtectedPrototypeMap.set(publicPrototype, protectedPrototype)

    // private stuff is not inherited to child class APIs, it lives only in the
    // APIs of the class where defined, so no prototype inheritance here
    const privatePrototype = {}

    const scope = {
        privatePrototype,
        protectedPrototype,
    }

    const _getPublicMembers = getPublicMembers.bind( null, scope )
    const _getProtectedMembers = getProtectedMembers.bind( null, scope )
    const _getPrivateMembers = getPrivateMembers.bind( null, scope )

    const definition = definerFunction( _getPublicMembers, _getProtectedMembers, _getPrivateMembers)

    copyDescriptors(_getPublicMembers, publicPrototype)
    copyDescriptors(_getProtectedMembers, protectedPrototype)
    copyDescriptors(_getPrivateMembers, privatePrototype)

    if (typeof definition == 'object') {
        if (typeof definition.public == 'object') copyDescriptors(definition.public, publicPrototype)
        if (typeof definition.protected == 'object') copyDescriptors(definition.protected, protectedPrototype)
        if (typeof definition.private == 'object') copyDescriptors(definition.private, privatePrototype)
        delete definition.public
        delete definition.protected
        delete definition.private
        copyDescriptors(definition, publicPrototype)
    }

    const NewClass = new Function('scope, originalContructor, publicPrototype, protectedPrototype, privatePrototype, ParentClass, publicInstanceToProtectedInstanceMap', `
        return function ${className}() {
            console.log('parent class', ParentClass.name)
            if ( !scope.publicInstance ) {
                scope.protectedInstance = Object.create( protectedPrototype )
                scope.privateInstance = Object.create( privatePrototype )
                scope.publicInstance = this

                console.log('map public to protected instance', this.constructor.name)
                publicInstanceToProtectedInstanceMap.set( this, scope.protectedInstance )
            }

            if (originalContructor)
                originalContructor.apply(this, arguments)
            else
                ParentClass.apply(this, arguments)
        }
    `)( scope, publicPrototype.constructor, publicPrototype, protectedPrototype, privatePrototype, ParentClass, publicInstanceToProtectedInstanceMap )

    scope.NewClass = NewClass

    NewClass.prototype = publicPrototype
    NewClass.prototype.constructor = NewClass // TODO: make non-writable and non-configurable like ES6+

    NewClass.subclass = Class

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

function getPublicMembers( scope, instance ) {

    if (
        instance === scope.privateInstance ||
        instance === scope.protectedInstance
    ) {
        return scope.publicInstance
    }

    else if ( instance === scope.publicInstance )
        return instance

    throw new InvalidAccessError('invalid member access')
}

function getProtectedMembers( scope, instance ) {

    if (
        instance === scope.publicInstance ||
        instance === scope.privateInstance
    ) {
        return scope.protectedInstance
    }

    else if ( instance === scope.protectedInstance )
        return instance

    else if ( instance instanceof scope.NewClass ) 
        return publicInstanceToProtectedInstanceMap.get( instance )

    throw new InvalidAccessError('invalid member access')
}

function getPrivateMembers( scope, instance ) {

    if (
        instance === scope.publicInstance ||
        instance === scope.protectedInstance
    ) {
        return scope.privateInstance
    }

    else if ( instance === scope.privateInstance )
        return instance

    throw new InvalidAccessError('invalid member access')
}

module.exports = Class
module.exports.InvalidAccessError = InvalidAccessError
