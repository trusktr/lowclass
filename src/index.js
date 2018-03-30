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

// used during construction of any class (always synchronous)
const newTargetStack = []

const defaultOptions = {
    mode: 'es5' // es5 class inheritance is simple, nice, easy, and robust
    //mode: 'Reflect.construct', // es6+ class inheritance is tricky, difficult, and restrictive
}

class InvalidSuperAccessError extends Error {}
class InvalidAccessError extends Error {}

const Class = createClassHelper()

module.exports = Class
Object.assign(module.exports, {
    Class,
    createClassHelper,
    InvalidSuperAccessError,
    InvalidAccessError,
})

function createClassHelper( options ) {
    "use strict"

    options = options || defaultOptions

    /*
     * this is just the public interface adapter for createClass(). Depending on how
     * you call this interface, you can do various things like:
     *
     *   // anonymous empty class
     *   Class()
     *
     *   // named empty class, TODO
     *   Class('Foo')
     *
     *   // base class named Foo
     *   Class('Foo', (Public, Protected, Private) => {
     *     someMethod() { ... },
     *   })
     *
     *   // anonymous base class
     *   Class((Public, Protected, Private) => {
     *     someMethod() { ... },
     *   })
     *
     *   Class('Foo').extends(OtherClass, (Public, Protected, Private) => ({
     *     someMethod() { ... },
     *   }))
     *
     *   OtherClass.subclass = Class
     *   const Bar = OtherClass.subclass('Bar', (Public, Protected, Private) => {...})
     *
     *   // any class made with lowclass has a static subclass if you prefer using that:
     *   Bar.subclass('Baz', (Public, Protected, Private) => {...})
     *
     *   // But you could as well do
     *   Class('Baz').extends(Bar, (Public, Protected, Private) => {...})
     */
    return function Class(...args) {

        let makingSubclass = false

        // if called as SomeConstructor.subclass, or bound to SomeConstructor
        if ( typeof this === 'function' ) makingSubclass = true

        // f.e. `Class()` or `Class('Foo')`, similar to `class {}` or `class Foo {}`
        if ( args.length <= 2 ) {

            let name = ''
            let definerFunction = null

            // f.e. `Class('Foo')`
            if ( typeof args[0] === 'string' ) name = args[0]

            // f.e. `Class((pub, prot, priv) => ({ ... }))`
            else if ( typeof args[0] === 'function' ) definerFunction = args[0]

            // f.e. `Class('Foo', (pub, prot, priv) => ({ ... }))`
            if ( typeof args[1] === 'function' ) definerFunction = args[1]

            // Make a class in case we wanted to do just `Class()` or `Class('Foo')`...
            const Ctor = makingSubclass ?
                createClass.call( this, name, definerFunction ) :
                createClass( name, definerFunction )

            // ...but add the extends helper in case we wanted to do
            // `Class('Foo').extends(OtherClass, (Public, Protected, Private) => ({ ... }))`
            Ctor.extends = function( ParentClass, definerFunction ) {
                definerFunction = definerFunction || (() => {})
                return createClass.call( ParentClass, name, definerFunction )
            }

            return Ctor
        }

        throw new TypeError('invalid args')
    }

    /**
     * @param {string} className The name that the class being defined should have.
     * @param {Function} definerFunction A function for defining the class. It is passed the Public, Protected, Private, and _super helpers.
     */
    function createClass(className, definerFunction) {
        "use strict"

        const { mode } = options

        // f.e. Class((Public, Protected, Private) => ({ ... }))
        if ( typeof className === 'function' ) {
            definerFunction = className
            className = definerFunction.name || ''
        }

        // TODO the TypeError doesn't make sense if first arg is string and second arg is object.
        else if (typeof className !== 'string')
            throw new TypeError(`If supplying two arguments, you must specify a string for the first 'className' argument. If supplying only one argument, it must be a function.`)

        // f.e. Class('Foo', { ... })
        if ( typeof definerFunction === 'object' && definerFunction ) {
            throw new Error(' TODO: definition object ')
        }

        // return a basic class early, for performance, if there's no class
        // definition, f.e. `Class()` or `Class('Foo')` creates an anonymous or
        // empty named class, respectively, so no need to run the heavier
        // logic.
        else if ( typeof definerFunction !== 'function' ) {
            let Class

            if ( className ) eval(`Class = function ${className}() {}`)
            else Class = (() => function() {})() // force anonymous even in ES6+

            Class.prototype = { __proto__: Object.prototype, constructor: Class }

            // no static inheritance here, just like with `class Foo {}`

            return Class
        }

        // f.e. ParentClass.subclass((Public, Protected, Private) => {...})
        const ParentClass = this || Object

        const parentPublicPrototype = ParentClass.prototype

        // A two-way map to associate public instances with private instances.
        // Unlike publicToProtected, this is inside here because there is one
        // private instance per class scope per instance (or to say it another way,
        // each instance has as many private instances as the number of classes
        // that the given instance has in its inheritance chain, one private
        // instance per class)
        const publicToPrivate = new WeakTwoWayMap

        // the class "scope" that we will bind to the helper functions
        const scope = {
            publicToPrivate,
            parentPublicPrototype,
        }

        // create the super helper for this class scope
        const supers = new WeakMap
        const _super = superHelper.bind( null, supers, scope )

        // bind this class' scope to the helper functions
        const _getPublicMembers = getPublicMembers.bind( null, scope )
        const _getProtectedMembers = getProtectedMembers.bind( null, scope )
        const _getPrivateMembers = getPrivateMembers.bind( null, scope )

        // pass the helper functions to the user's class definition function
        const definition =
            definerFunction && definerFunction( _getPublicMembers, _getProtectedMembers, _getPrivateMembers, _super)

        // the user has the option of returning an object that defines which
        // properties are public/protected/private.
        if (definition && typeof definition !== 'object') {
            throw new TypeError('The return value of a class definer function, if any, should be an object.')
        }

        // extend the parent class
        const publicPrototype = definition && definition.public || definition || {}
        publicPrototype.__proto__ = parentPublicPrototype

        // extend the parent protected prototype
        const parentProtectedPrototype = publicProtoToProtectedProto.get(parentPublicPrototype) || {}
        const protectedPrototype = definition && definition.protected || {}
        protectedPrototype.__proto__ = parentProtectedPrototype
        publicProtoToProtectedProto.set(publicPrototype, protectedPrototype)

        // private prototype does not inherit from parent, each private instance is
        // private only for the class of this scope
        const privatePrototype = definition && definition.private || {}

        scope.publicPrototype = publicPrototype
        scope.privatePrototype = privatePrototype
        scope.protectedPrototype = protectedPrototype
        scope.parentProtectedPrototype = parentProtectedPrototype

        // the user has the option of assigning methods and properties to the
        // helpers that we passed in, to let us know which methods and properties are
        // public/protected/private so we can assign them onto the respective
        // prototypes.
        copyDescriptors(_getPublicMembers, publicPrototype)
        copyDescriptors(_getProtectedMembers, protectedPrototype)
        copyDescriptors(_getPrivateMembers, privatePrototype)

        // if a `public` object was also supplied, also copy the definition props
        // to the `public` prototype
        //
        // TODO For now we prioritize the "public" object returned from the
        // definer, and copy from the definition to the publicPrototype, but this
        // won't work with `super`. Maybe later, we can use a Proxy to read props
        // from both the root object and the public object, so that `super` works
        // from both.
        if (definition && definition !== publicPrototype) {

            // delete these so we don't copy them
            delete definition.public
            delete definition.protected
            delete definition.private

            // copy whatever remains
            copyDescriptors(definition, publicPrototype)
        }

        let NewClass = null

        // ES5 version (which seems to be so much better)
        if ( mode === 'es5' ) {

            const userConstructor = publicPrototype.constructor

            // Create the constructor for the class of this scope.
            // We create the constructor inside of this immediately-invoked function (IIFE)
            // just so that we can give it a `className`.
            // We pass whatever we need from the outer scope into the IIFE.
            NewClass = new Function(`
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

                    // make a private instance. Each class constructor will create one
                    // for a given instance because each constructor accesses the
                    // publicToPrivate map from its class scope (it isn't shared like
                    // publicToProtected is)
                    privateInstance = Object.create( privatePrototype )
                    publicToPrivate.set( this, privateInstance )

                    if (userConstructor) userConstructor.apply(this, arguments)
                    else ParentClass.apply(this, arguments)
                }
            `)(
                userConstructor,
                publicPrototype,
                protectedPrototype,
                privatePrototype,
                ParentClass,
                publicToProtected,
                publicToPrivate
            )

            // standard ES5 class definition
            NewClass.__proto__ = ParentClass // static inheritance
            NewClass.prototype = publicPrototype
            NewClass.prototype.constructor = NewClass // TODO: make non-writable and non-configurable like ES6+

        }

        // ES6+ version (which seems to be dumb)
        else if ( mode === 'Reflect.construct' ) {

            const userConstructor = publicPrototype.hasOwnProperty('constructor') ? publicPrototype.constructor : false

            if (userConstructor) {
                console.log('userConstructor:', userConstructor)
                console.log('parent class:', ParentClass)
                userConstructor.__proto__ = ParentClass // static inheritance
                userConstructor.prototype = publicPrototype
                //userConstructor.prototype.constructor = userConstructor // already the case
            }

            // Create the constructor for the class of this scope.
            // We create the constructor inside of this immediately-invoked function (IIFE)
            // just so that we can give it a `className`.
            // We pass whatever we need from the outer scope into the IIFE.
            NewClass = new Function(`
                userConstructor,
                publicPrototype,
                protectedPrototype,
                privatePrototype,
                ParentClass,
                publicToProtected,
                publicToPrivate,
                newTargetStack
            `, `
                //return class ${className} extends ParentClass
                return function ${className}() {
                    let self = null

                    console.log(" ------------- userConstructor?")
                    console.log(userConstructor && userConstructor.toString())

                    let newTarget = new.target

                    if ( newTarget ) newTargetStack.push( newTarget )
                    else newTarget = newTargetStack[ newTargetStack.length - 1 ]

                    if (userConstructor) {
                        console.log('??????????', userConstructor, arguments, newTarget)
                        self = Reflect.construct( userConstructor, arguments, newTarget )
                    }
                    else self = Reflect.construct( ParentClass, arguments, newTarget )

                    newTargetStack.pop()

                    // make a protected instance if it doesn't exist already. Only the
                    // child-most class constructor will create the protected instance,
                    // because the publicToProtected map is shared among them all.
                    let protectedInstance = publicToProtected.get( self )
                    if ( !protectedInstance ) {
                        protectedInstance = Object.create( protectedPrototype )
                        publicToProtected.set( self, protectedInstance )
                    }

                    // make a private instance. Each class constructor will create one
                    // for a given instance because each constructor accesses the
                    // publicToPrivate map from its class scope (it isn't shared like
                    // publicToProtected is)
                    privateInstance = Object.create( privatePrototype )
                    publicToPrivate.set( self, privateInstance )

                    return self
                }
            `)(
                userConstructor,
                publicPrototype,
                protectedPrototype,
                privatePrototype,
                ParentClass,
                publicToProtected,
                publicToPrivate,
                newTargetStack
            )

            // static inheritance
            if (userConstructor) NewClass.__proto__ = userConstructor
            else NewClass.__proto__ = ParentClass

            NewClass.prototype = Object.create( publicPrototype )
            NewClass.prototype.constructor = NewClass // TODO: make non-writable and non-configurable like ES6+

        }

        else {
            throw new TypeError('The lowclass mode option should be one of: "es5", "Reflect.construct".')
        }

        // allow users to make subclasses. This defines what `this` is in the above
        // definition of ParentClass.
        NewClass.subclass = Class

        return NewClass
    }
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
function copyDescriptors(source, destination, mod) {
    const props = Object.keys(source)
    let i = props.length
    while (i--) {
        const prop = props[i]
        const descriptor = Object.getOwnPropertyDescriptor(source, prop)
        if (mod) mod(descriptor)
        Object.defineProperty(destination, prop, descriptor)
    }
}

function superHelper( supers, scope, instance ) {
    const {
        publicPrototype,
        protectedPrototype,
        parentPublicPrototype,
        parentProtectedPrototype,
    } = scope

    if ( hasPrototype( instance, publicPrototype ) )
        return getSuperHelperObject( instance, parentPublicPrototype, supers )

    if ( hasPrototype( instance, protectedPrototype ) )
        return getSuperHelperObject( instance, parentProtectedPrototype, supers )

    // TODO: does it make sense to add _super support for private members
    // here? Let's add it when/if we need it.

    throw new InvalidSuperAccessError('invalid super access')
}

function getSuperHelperObject( instance, parentPrototype, supers ) {
    let _super = supers.get( instance )
    if ( !_super ) {
        supers.set( instance, _super = {} )
        copyDescriptors( parentPrototype, _super, (descriptor) => {
            if ( descriptor.value && typeof descriptor.value === 'function' ) {
                descriptor.value = descriptor.value.bind( instance )
            }
            //else { TODO how to handle get/set
                //descriptor.get = descriptor.get.bind( instance )
                //descriptor.set = descriptor.set.bind( instance )
            //}
        })
    }
    return _super
}
