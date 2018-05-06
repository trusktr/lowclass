// TODO
//  [x] remove the now-unnecessary modes (leave just what was 'es5' mode)
//  [x] link helpers to each other, making it possible to destructure the arguments to definer functions
//  [x] let access helper prototype objects extend from Object, otherwise common tools are not available.
//  [x] accept a function as return value of function definer, to be treated as a class to derive the definition from, so that it can have access to Protected and Private helpers
//  [x] let the returned class define protected and private getters which return the protected and private definitions.
//  [x] migrate to builder-js-package so tests can run in the browser, and we can test custom elements
//  [ ] protected and private static members
//  [ ] other TODOs in the code

import {
    getFunctionBody,
    setDescriptor,
    setDescriptors,
    propertyIsAccessor,
    getInheritedDescriptor,
    getInheritedPropertyNames,
    WeakTwoWayMap,
} from './utils'

const staticBlacklist = [ 'subclass', 'extends',
    ...Object.getOwnPropertyNames( new Function() )
]

const publicProtoToProtectedProto = new WeakMap
const publicProtoToPrivateProto = new WeakMap

// A two-way map to associate public instances with protected instances.
// There is one protected instance per public instance
const publicToProtected = new WeakTwoWayMap

// so we can get the class scope associated with a private instance
const privateInstanceToClassScope = new WeakMap

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
        configurable: true,
    },
    setClassDescriptors: true,

}

class InvalidSuperAccessError extends Error {}
class InvalidAccessError extends Error {}

const Class = createClassHelper()

export {
    Class,
    createClassHelper,
    InvalidSuperAccessError,
    InvalidAccessError,
    staticBlacklist,
}

export default Class

function createClassHelper( options ) {
    options = options ? { ...defaultOptions, ...options } : defaultOptions

    options.defaultClassDescriptor = {
        ...defaultOptions.defaultClassDescriptor,
        ...options.defaultClassDescriptor
    }

    const {
        mode, prototypeWritable, setClassDescriptors, nativeNaming
    } = options

    /*
     * this is just the public interface adapter for createClass(). Depending
     * on how you call this interface, you can do various things like:
     *
     * - anonymous empty class
     *
     *    Class()
     *
     * - named empty class
     *
     *    Class('Foo')
     *
     * - base class named Foo
     *
     *    Class('Foo', (Public, Protected, Private) => {
     *      someMethod() { ... },
     *    })
     *
     * - anonymous base class
     *
     *    Class((Public, Protected, Private) => {
     *      someMethod() { ... },
     *    })
     *
     *    Class('Foo').extends(OtherClass, (Public, Protected, Private) => ({
     *      someMethod() { ... },
     *    }))
     *
     *    OtherClass.subclass = Class
     *    const Bar = OtherClass.subclass((Public, Protected, Private) => {
     *      ...
     *    })
     *
     * - any class made with lowclass has a static subclass if you prefer using
     *   that:
     *
     *    Bar.subclass('Baz', (Public, Protected, Private) => {...})
     *
     * - but you could as well do
     *
     *    Class('Baz').extends(Bar, (Public, Protected, Private) => {...})
     */
    return function Class( ...args ) {

        let makingSubclass = false

        // if called as SomeConstructor.subclass, or bound to SomeConstructor
        if ( typeof this === 'function' ) makingSubclass = true

        // f.e. `Class()` or `Class('Foo')`, similar to `class {}` or
        // `class Foo {}`
        if ( args.length <= 2 ) {

            let name = ''
            let definer = null

            // f.e. `Class('Foo')`
            if ( typeof args[0] === 'string' ) name = args[0]

            // f.e. `Class((pub, prot, priv) => ({ ... }))`
            else if (
                typeof args[0] === 'function' || typeof args[0] === 'object'
            ) {
                definer = args[0]
            }

            // f.e. `Class('Foo', (pub, prot, priv) => ({ ... }))`
            if ( typeof args[1] === 'function' || typeof args[1] === 'object' )
                definer = args[1]

            // Make a class in case we wanted to do just `Class()` or
            // `Class('Foo')`...
            const Ctor = makingSubclass ?
                createClass.call( this, name, definer ) :
                createClass( name, definer )

            // ...but add the extends helper in case we wanted to do like:
            // Class().extends(OtherClass, (Public, Protected, Private) => ({
            //   ...
            // }))
            Ctor.extends = function( ParentClass, def ) {
                def = def || definer
                return createClass.call( ParentClass, name, def )
            }

            return Ctor
        }

        throw new TypeError( 'invalid args' )
    }

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
    function createClass( className, definer ) {
        "use strict"

        // f.e. ParentClass.subclass((Public, Protected, Private) => {...})
        let ParentClass = this

        if ( typeof className !== 'string' ) {
            throw new TypeError(`
                You must specify a string for the 'className' argument.
            `)
        }

        let definition = null

        // f.e. Class('Foo', { ... })
        if ( definer && typeof definer === 'object' ) {
            definition = definer
        }

        // Return early if there's no definition or parent class, just a simple
        // extension of Object. f.e. when doing just `Class()` or
        // `Class('Foo')`
        else if (
            !ParentClass && (
                !definer || (
                    typeof definer !== 'function' &&
                    typeof definer !== 'object'
                )
            )
        ) {
            let Ctor

            if ( nativeNaming && className )
                Ctor = new Function( `return function ${ className }() {}` )()
            else {
                // force anonymous even in ES6+
                Ctor = ( () => function() {} )()

                if ( className )
                    setDescriptor( Ctor, 'name', { value: className } )
            }

            Ctor.prototype = { __proto__: Object.prototype, constructor: Ctor }

            // no static inheritance here, just like with `class Foo {}`

            setDescriptor(Ctor, 'subclass', {
                value: Class,
                writable: true, // TODO maybe let's make this non writable
                enumerable: false,
                configurable: false,
            })

            return Ctor
        }

        // A two-way map to associate public instances with private instances.
        // Unlike publicToProtected, this is inside here because there is one
        // private instance per class scope per instance (or to say it another
        // way, each instance has as many private instances as the number of
        // classes that the given instance has in its inheritance chain, one
        // private instance per class)
        const publicToPrivate = new WeakTwoWayMap

        // the class "scope" that we will bind to the helper functions
        const scope = {
            publicToPrivate,
        }

        // create the super helper for this class scope
        const supers = new WeakMap
        const Super = superHelper.bind( null, supers, scope )

        // bind this class' scope to the helper functions
        const Public = getPublicMembers.bind( null, scope )
        const Protected = getProtectedMembers.bind( null, scope )
        const Private = getPrivateMembers.bind( null, scope )

        Public.prototype = {}
        Protected.prototype = {}
        Private.prototype = {}

        // alows the user to destructure arguments to definer functions
        Public.Public = Public
        Public.Protected = Protected
        Public.Private = Private
        Public.Super = Super
        Protected.Public = Public
        Protected.Protected = Protected
        Protected.Private = Private
        Protected.Super = Super
        // Private and Super are never passed as first argument

        // pass the helper functions to the user's class definition function
        definition = definition || definer && definer(
            Public, Protected, Private, Super
        )

        // the user has the option of returning an object that defines which
        // properties are public/protected/private.
        if ( definition && typeof definition !== 'object' && typeof definition !== 'function' ) {
            throw new TypeError(`
                The return value of a class definer function, if any, should be
                an object, or a class constructor.
            `)
        }

        // if a function was returned, we assume it is a class from which we
        // get the public definition from.
        let customClass = null
        if ( typeof definition === 'function' ) {
            customClass = definition
            definition = definition.prototype
            ParentClass = customClass.prototype.__proto__.constructor
        }

        let staticMembers

        // if functions were provided for the public/protected/private
        // properties of the definition object, execute them with their
        // respective access helpers, and use the objects returned from them.
        if ( definition ) {

            staticMembers = definition.static
            delete definition.static

            if ( typeof definition.public === 'function' ) {
                definition.public = definition.public(
                    Protected, Private
                )
            }

            if ( typeof definition.protected === 'function' ) {
                definition.protected = definition.protected(
                    Public, Private
                )
            }

            if ( typeof definition.private === 'function' ) {
                definition.private = definition.private(
                    Public, Protected
                )
            }

        }

        ParentClass = ParentClass || Object

        // extend the parent class
        const parentPublicPrototype = ParentClass.prototype
        const publicPrototype = definition && definition.public ||
            definition || Object.create( parentPublicPrototype )
        if ( publicPrototype.__proto__ !== parentPublicPrototype )
            publicPrototype.__proto__ = parentPublicPrototype

        // extend the parent protected prototype
        const parentProtectedPrototype =
            publicProtoToProtectedProto.get( parentPublicPrototype ) || {}
        const protectedPrototype = definition && definition.protected
            || Object.create( parentProtectedPrototype )
        if ( protectedPrototype.__proto__ !== parentProtectedPrototype )
            protectedPrototype.__proto__ = parentProtectedPrototype
        publicProtoToProtectedProto.set( publicPrototype, protectedPrototype )

        // private prototype inherits from parent, but each private instance is
        // private only for the class of this scope
        const parentPrivatePrototype =
            publicProtoToPrivateProto.get( parentPublicPrototype ) || {}
        const privatePrototype = definition && definition.private
            || Object.create( parentPrivatePrototype )
        if ( privatePrototype.__proto__ !== parentPrivatePrototype )
            privatePrototype.__proto__ = parentPrivatePrototype
        publicProtoToPrivateProto.set( publicPrototype, privatePrototype )

        scope.publicPrototype = publicPrototype
        scope.privatePrototype = privatePrototype
        scope.protectedPrototype = protectedPrototype
        scope.parentPublicPrototype = parentPublicPrototype
        scope.parentProtectedPrototype = parentProtectedPrototype
        scope.parentPrivatePrototype = parentPrivatePrototype

        // the user has the option of assigning methods and properties to the
        // helpers that we passed in, to let us know which methods and
        // properties are public/protected/private so we can assign them onto
        // the respective prototypes.
        copyDescriptors(Public.prototype, publicPrototype)
        copyDescriptors(Protected.prototype, protectedPrototype)
        copyDescriptors(Private.prototype, privatePrototype)

        if ( definition ) {
            // delete these so we don't expose them on the class' public
            // prototype
            delete definition.public
            delete definition.protected
            delete definition.private

            // if a `public` object was also supplied, we treat that as the public
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
                copyDescriptors(definition, publicPrototype)
            }
        }

        if ( customClass ) {
            if ( staticMembers ) copyDescriptors( staticMembers, customClass )
            return customClass
        }

        const userConstructor =
            publicPrototype.hasOwnProperty('constructor') ?
            publicPrototype.constructor :
            null

        let NewClass = null
        let newPrototype = null

        // ES5 version (which seems to be so much better)
        if ( mode === 'es5' ) {

            NewClass = ( () => function() {

                let ret = null

                let constructor = null

                if ( userConstructor ) constructor = userConstructor
                else constructor = ParentClass

                // Object is a special case because otherwise
                // `Object.apply(this)` returns a different object and we don't
                // want to deal with return value in that case
                if ( constructor !== Object )
                    ret = constructor.apply( this, arguments )

                if ( ret && typeof ret === 'object' ) {
                    // XXX should we set ret.__proto__ = constructor.prototype
                    // here? Or let the user deal with that?
                    return ret
                }

            } )()

            newPrototype = publicPrototype

        }

        else {
            throw new TypeError(`
                The lowclass mode option can only be 'es5' for now.
            `)
        }

        if ( className ) {
            if ( nativeNaming ) {

                const code = getFunctionBody( NewClass )
                const proto = NewClass.prototype

                NewClass = new Function(` userConstructor, ParentClass `, `
                    return function ${className}() { ${code} }
                `)( userConstructor, ParentClass )

                NewClass.prototype = proto
            }
            else {
                setDescriptor( NewClass, 'name', { value: className } )
            }
        }

        if ( userConstructor && userConstructor.length ) {
            // length is not writable, only configurable, therefore the value
            // has to be set with a descriptor update
            setDescriptor( NewClass, 'length', {
                value: userConstructor.length
            })
        }

        // static stuff {

        // static inheritance
        NewClass.__proto__ = ParentClass

        if ( staticMembers ) copyDescriptors( staticMembers, NewClass )

        // allow users to make subclasses. When subclass is called on a
        // constructor, it defines `this` which is assigned to ParentClass
        // above.
        setDescriptor(NewClass, 'subclass', {
            value: Class,
            writable: true,
            enumerable: false,
            configurable: false,
        })

        // }

        // prototype stuff {

        NewClass.prototype = newPrototype

        NewClass.prototype.constructor = NewClass

        // }

        if ( setClassDescriptors ) {
            setDefaultStaticDescriptors( NewClass, options )
            setDescriptor(NewClass, 'prototype', {writable: prototypeWritable})
            setDefaultPrototypeDescriptors( NewClass.prototype, options )
            setDefaultPrototypeDescriptors( protectedPrototype, options )
            setDefaultPrototypeDescriptors( privatePrototype, options )
        }

        return NewClass
    }
}

// XXX PERFORMANCE: instead of doing multiple prototype traversals with
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

function getPublicMembers( scope, instance ) {

    // check only for the private instance of this class scope
    if ( hasPrototype( instance, scope.privatePrototype ) )
        return getSubclassScope( instance ).publicToPrivate.get( instance )

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
        return publicToProtected.get( instance ) || createProtectedInstance( instance )

    // check for a private instance inheriting from this class scope
    else if ( hasPrototype( instance, scope.privatePrototype ) ) {
        const publicInstance = getSubclassScope( instance ).publicToPrivate.get( instance )
        return publicToProtected.get( publicInstance ) || createProtectedInstance( publicInstance )
    }

    // return the protected instance if it was passed in
    else if ( hasPrototype( instance, scope.protectedPrototype ) )
        return instance

    throw new InvalidAccessError('invalid access of protected member')
}

function getSubclassScope( privateInstance ) {
    return privateInstanceToClassScope.get( privateInstance )
}

function createProtectedInstance( publicInstance ) {

    // traverse instance proto chain, find first protected prototype
    const protectedPrototype = findLeafmostProtectedPrototype( publicInstance )

    // make the protected instance from the found protected prototype
    const protectedInstance = Object.create( protectedPrototype )
    publicToProtected.set( publicInstance, protectedInstance )
    return protectedInstance
}

function findLeafmostProtectedPrototype( publicInstance ) {
    let result = null
    let currentProto = publicInstance.__proto__

    while ( currentProto ) {
        result = publicProtoToProtectedProto.get( currentProto )
        if ( result ) return result
        currentProto = currentProto.__proto__
    }

    return result
}

function getPrivateMembers( scope, instance ) {

    // check for a public instance that is or inherits from this class
    if ( hasPrototype( instance, scope.publicPrototype ) )
        return scope.publicToPrivate.get( instance ) || createPrivateInstance( scope, instance )

    // check for a protected instance that is or inherits from this class'
    // protectedPrototype
    else if ( hasPrototype( instance, scope.protectedPrototype ) ) {
        const publicInstance = publicToProtected.get( instance )
        return scope.publicToPrivate.get( publicInstance ) || createPrivateInstance( scope, publicInstance )
    }

    // return the private instance if it was passed in
    else if ( hasPrototype( instance, scope.privatePrototype ) )
        return instance

    throw new InvalidAccessError('invalid access of private member')
}

function createPrivateInstance( scope, publicInstance ) {
    const privateInstance = Object.create( scope.privatePrototype )
    scope.publicToPrivate.set( publicInstance, privateInstance )
    privateInstanceToClassScope.set( privateInstance, scope )
    return privateInstance
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
    const props = Object.getOwnPropertyNames(source)
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
        privatePrototype,
        parentPublicPrototype,
        parentProtectedPrototype,
        parentPrivatePrototype
    } = scope

    if ( hasPrototype( instance, publicPrototype ) )
        return getSuperHelperObject( instance, parentPublicPrototype, supers )

    if ( hasPrototype( instance, protectedPrototype ) )
        return getSuperHelperObject(instance, parentProtectedPrototype, supers)

    if ( hasPrototype( instance, privatePrototype ) )
        return getSuperHelperObject( instance, parentPrivatePrototype, supers )

    throw new InvalidSuperAccessError('invalid super access')
}

function getSuperHelperObject( instance, parentPrototype, supers ) {
    let _super = supers.get( instance )

    // XXX PERFORMANCE: there's probably some ways to improve speed here using caching
    if ( !_super ) {
        supers.set( instance, _super = Object.create( parentPrototype ) )

        const keys = getInheritedPropertyNames( parentPrototype )
        let i = keys.length

        while (i--) {
            const key = keys[i]

            setDescriptor( _super, key, {

                get: function() {
                    let value = void undefined

                    const descriptor = getInheritedDescriptor( parentPrototype, key )

                    if ( descriptor && propertyIsAccessor( descriptor ) ) {
                        const getter = descriptor.get
                        if ( getter ) value = getter.call( instance )
                    }
                    else {
                        value = parentPrototype[ key ]
                    }

                    if ( value && value.call && typeof value === 'function' ) {
                        value = value.bind( instance )
                    }

                    return value
                },

                // like native `super`, setting a super property does nothing.
                set: function( value ) {
                    const descriptor = getInheritedDescriptor( parentPrototype, key )

                    if ( descriptor && propertyIsAccessor( descriptor ) ) {
                        const setter = descriptor.set
                        if ( setter ) value = setter.call( instance, value )
                    }
                    else {
                        // just like native `super`
                        instance[ key ] = value
                    }
                },

            }, true)
        }
    }

    return _super
}

function setDefaultPrototypeDescriptors( prototype,
    { defaultClassDescriptor: { writable, enumerable, configurable } }
) {
    const descriptors = Object.getOwnPropertyDescriptors( prototype )
    let descriptor

    for ( const key in descriptors ) {
        descriptor = descriptors[ key ]

        // regular value
        if ( 'value' in descriptor || 'writable' in descriptor ) {
            descriptor.writable = writable
        }

        // accessor or regular value
        descriptor.enumerable = enumerable
        descriptor.configurable = configurable
    }

    setDescriptors( prototype, descriptors )
}

function setDefaultStaticDescriptors( Ctor,
    { defaultClassDescriptor: { writable, enumerable, configurable } }
) {
    const descriptors = Object.getOwnPropertyDescriptors( Ctor )
    let descriptor

    for ( const key in descriptors ) {
        if ( staticBlacklist.includes( key ) ) {
            delete descriptors[ key ]
            continue
        }

        descriptor = descriptors[ key ]

        // regular value
        if ( 'value' in descriptor || 'writable' in descriptor ) {
            descriptor.writable = writable
        }

        // accessor or regular value
        descriptor.enumerable = enumerable
        descriptor.configurable = configurable
    }

    setDescriptors( Ctor, descriptors )
}

export const version = '4.0.1'
