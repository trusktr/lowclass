const publicProtoToProtectedProto = new WeakMap

class WeakTwoWayMap {
    constructor() { this.m = new WeakMap }
    set( a, b ) { this.m.set( a, b ); this.m.set( b, a ) }
    get( item ) { return this.m.get( item ) }
    has( item ) { return this.m.has( item ) }
}

// A two-way map to associate public instances with protected instances.
// There is one protected instance per public instance
const publicToProtected = new WeakTwoWayMap

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

    // A two-way map to associate public instances with private instances.
    // Unlike publicToProtected, this is inside here because there is one
    // private instance per Class scope per instance (or to say it another way,
    // each instance has as many private instances as the number of classes
    // that the given instance has in its inheritance chain, one private
    // instance per class)
    const publicToPrivate = new WeakTwoWayMap

    const ParentClass = this || Object

    // extend the parent class
    const publicPrototype = Object.create(ParentClass.prototype)

    // extend the parent protected prototype
    const parentProtectedPrototype = publicProtoToProtectedProto.get(ParentClass.prototype) || {}
    const protectedPrototype = Object.create(parentProtectedPrototype)
    publicProtoToProtectedProto.set(publicPrototype, protectedPrototype)

    // private prototype does not inherit from parent, each private instance is
    // private only for the class of this scope
    const privatePrototype = {}

    // the class "scope" that we will bind to the helper functions
    const scope = {
        publicPrototype,
        privatePrototype,
        protectedPrototype,
        publicToPrivate,
    }

    // bind this class' scope to the helper functions
    const _getPublicMembers = getPublicMembers.bind( null, scope )
    const _getProtectedMembers = getProtectedMembers.bind( null, scope )
    const _getPrivateMembers = getPrivateMembers.bind( null, scope )

    // pass the helper functions to the user's class definition function
    const definition = definerFunction( _getPublicMembers, _getProtectedMembers, _getPrivateMembers)

    // the user has the option of assigning methods and properties to the
    // helpers that we passed in, to let us know which methods and properties are
    // public/protected/private so we can assign them onto the respective
    // prototypes.
    copyDescriptors(_getPublicMembers, publicPrototype)
    copyDescriptors(_getProtectedMembers, protectedPrototype)
    copyDescriptors(_getPrivateMembers, privatePrototype)

    // the user also has the optio of returning an object that defines which
    // properties are public/protected/private
    if (typeof definition == 'object') {

        // copy the content public/protected/private properties onto the
        // respective prototypes
        if (typeof definition.public == 'object') copyDescriptors(definition.public, publicPrototype)
        if (typeof definition.protected == 'object') copyDescriptors(definition.protected, protectedPrototype)
        if (typeof definition.private == 'object') copyDescriptors(definition.private, privatePrototype)

        // delete them so that we can
        delete definition.public
        delete definition.protected
        delete definition.private

        // copy whatever remains as automatically public
        copyDescriptors(definition, publicPrototype)
    }

    // Create the constructor for the class of this scope.
    // We create the constructor inside of this immediately-invoked function (IIFE)
    // just so that we can give it a `className`.
    // We pass whatever we need from the outer scope into the IIFE.
    const NewClass = new Function(`
        userConstructor,
        publicPrototype,
        protectedPrototype,
        privatePrototype,
        ParentClass,
        publicToProtected,
        publicToPrivate
    `, `
        return function ${className}() {

            // make a protected instance if it doesn't exist already. Only the
            // child-most class constructor will create the protected instance,
            // because the publicToProtected map is shared among them all.
            let protectedInstance = publicToProtected.get( this )
            if ( !protectedInstance ) {
                protectedInstance = Object.create( protectedPrototype )
                publicToProtected.set( this, protectedInstance )
            }

            // make a private instance if it doesn't exist already. Each class
            // constructor will create one for a given instance because each
            // constructor accesses the publicToPrivate map from its class
            // scope (it isn't shared like publicToProtected is)
            let privateInstance = publicToPrivate.get( this )
            if ( !privateInstance ) {
                privateInstance = Object.create( privatePrototype )
                publicToPrivate.set( this, privateInstance )
            }

            if (userConstructor) userConstructor.apply(this, arguments)
            else ParentClass.apply(this, arguments)
        }
    `)(
        publicPrototype.constructor,
        publicPrototype,
        protectedPrototype,
        privatePrototype,
        ParentClass,
        publicToProtected,
        publicToPrivate
    )

    // standard ES5 class definition
    NewClass.prototype = publicPrototype
    NewClass.prototype.constructor = NewClass // TODO: make non-writable and non-configurable like ES6+

    // allow users to make subclasses. This defines what `this` is in the above
    // definition of ParentClass.
    NewClass.subclass = Class

    return NewClass
}

function getPublicMembers( scope, instance ) {

    // check only for the private instance of this class scope
    if ( instance.__proto__ === scope.privatePrototype )
        return scope.publicToPrivate.get( instance )

    // check for an instance of the class (or its subclasses) of this scope
    else if ( hasPrototype( instance, scope.protectedPrototype ) )
        return publicToProtected.get( instance )

    // otherwise just return whatever was passed in, it's public already!
    else return instance
}

class InvalidAccessError extends Error {}

function getProtectedMembers( scope, instance ) {

    // check for an instance of the class (or its subclasses) of this scope
    // This allows for example an instance of an Animal base class to access
    // protected members of an instance of a Dog child class.
    if ( hasPrototype( instance, scope.publicPrototype ) )
        return publicToProtected.get( instance )

    // check only for the private instance of this class scope
    else if ( instance.__proto__ === scope.privatePrototype )
        return publicToProtected.get( scope.publicToPrivate.get( instance ) )

    // return the protected instance if it was passed in
    else if ( hasPrototype( instance, scope.protectedPrototype ) )
        return instance

    throw new InvalidAccessError('invalid access of protected member')
}

function getPrivateMembers( scope, instance ) {

    // check for a public instance that is or inherits from this class
    if ( hasPrototype( instance, scope.publicPrototype ) )
        return scope.publicToPrivate.get( instance )

    // check for a protected instance that is or inherits from this class' protectedPrototype
    else if ( hasPrototype( instance, scope.protectedPrototype ) )
        return scope.publicToPrivate.get( publicToProtected.get( instance ) )

    // return the private instance if it was passed in
    else if ( instance.__proto__ === scope.privatePrototype )
        return instance

    throw new InvalidAccessError('invalid access of private member')
}

// check if an object has the given prototype in its chain
function hasPrototype( obj, proto ) {
    let currentProto = obj.__proto__

    do {
        if ( proto === currentProto ) return true
        currentProto = currentProto.__proto__
    } while ( currentProto )

    return false
}

// copy all properties (as descriptors) from source to destination
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
