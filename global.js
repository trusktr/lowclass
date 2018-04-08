var lowclass =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	// TODO
	//  [x] remove the now-unnecessary modes (leave just what was 'es5' mode)
	//  [x] link helpers to each other, making it possible to destructure the arguments to definer functions
	//  [x] let access helper prototype objects extend from Object, otherwise common tools are not available.
	//  [x] accept a function as return value of function definer, to be treated as a class to derive the definition from, so that it can have access to Protected and Private helpers
	//  [x] let the returned class define protected and private getters which return the protected and private definitions.
	//  [ ] migrate to builder-js-package so tests can run in the browser, and we can test custom elements
	//  [ ] allow property names to be prefixed with 'public', 'protected', and 'private' as an alternate way to specify visibility
	//  [ ] other TODOs in the code
	const {
	    getFunctionBody,
	    setDescriptor,
	    propertyIsAccessor,
	    getInheritedDescriptor,
	    getInheritedPropertyNames,
	    WeakTwoWayMap,
	} = __webpack_require__( 1 )

	const publicProtoToProtectedProto = new WeakMap
	const publicProtoToPrivateProto = new WeakMap

	// A two-way map to associate public instances with protected instances.
	// There is one protected instance per public instance
	const publicToProtected = new WeakTwoWayMap

	const defaultOptions = {

	    // es5 class inheritance is simple, nice, easy, and robust
	    // There was another mode, but it has been removed
	    mode: 'es5'

	}

	class InvalidSuperAccessError extends Error {}
	class InvalidAccessError extends Error {}

	const Class = createClassHelper()

	module.exports = Class
	Object.assign( module.exports, {
	    Class,
	    createClassHelper,
	    InvalidSuperAccessError,
	    InvalidAccessError,
	})

	function createClassHelper( options ) {
	    "use strict"

	    options = options || defaultOptions

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

	        const { mode } = options

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

	            if ( className ) eval( `Ctor = function ${ className }() {}` )
	            else {
	                // force anonymous even in ES6+
	                Ctor = ( () => function() {} )()
	            }

	            Ctor.prototype = { __proto__: Object.prototype, constructor: Ctor }

	            // no static inheritance here, just like with `class Foo {}`

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
	            // TODO For now we prioritize the "public" object returned from the
	            // definer, and copy from the definition to the publicPrototype, but
	            // this won't work with `super`. We should document this (write a test
	            // for it). Maybe later, we can use a Proxy to read props from both the
	            // root object and the public object, so that `super` works from both.
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

	            NewClass.prototype = publicPrototype

	        }

	        else {
	            throw new TypeError(`
	                The lowclass mode option can only be 'es5' for now.
	            `)
	        }

	        if ( className ) {

	            const code = getFunctionBody( NewClass )
	            const proto = NewClass.prototype

	            NewClass = new Function(` userConstructor, ParentClass `, `
	                return function ${className}() { ${code} }
	            `)( userConstructor, ParentClass )

	            NewClass.prototype = proto
	        }

	        if ( userConstructor && userConstructor.length ) {
	            // length is not writable, only configurable, therefore the value
	            // has to be set with a descriptor update
	            setDescriptor( NewClass, 'length', {
	                value: userConstructor.length
	            })
	        }

	        // static inheritance
	        NewClass.__proto__ = ParentClass

	        if ( staticMembers ) copyDescriptors( staticMembers, NewClass )

	        setDescriptor(NewClass.prototype, 'constructor', {
	            value: NewClass,
	            configurable: false,
	            writable: false,
	        })

	        // allow users to make subclasses. This defines what `this` is and gets
	        // assigned to ParentClass above in subsequent calls.
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
	        return publicToProtected.get( instance ) || createProtectedInstance( scope, instance )

	    // check only for the private instance of this class scope
	    else if ( instance.__proto__ === scope.privatePrototype ) {
	        const publicInstance = scope.publicToPrivate.get( instance )
	        return publicToProtected.get( publicInstance ) || createProtectedInstance( scope, publicInstance )
	    }

	    // return the protected instance if it was passed in
	    else if ( hasPrototype( instance, scope.protectedPrototype ) )
	        return instance

	    throw new InvalidAccessError('invalid access of protected member')
	}

	function createProtectedInstance( scope, publicInstance ) {

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
	    else if ( instance.__proto__ === scope.privatePrototype )
	        return instance

	    throw new InvalidAccessError('invalid access of private member')
	}

	function createPrivateInstance( scope, publicInstance ) {
	    const privateInstance = Object.create( scope.privatePrototype )
	    scope.publicToPrivate.set( publicInstance, privateInstance )
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	
	class WeakTwoWayMap {
	    constructor() { this.m = new WeakMap }
	    set( a, b ) { this.m.set( a, b ); this.m.set( b, a ) }
	    get( item ) { return this.m.get( item ) }
	    has( item ) { return this.m.has( item ) }
	}

	module.exports = {
	    getFunctionBody,
	    setDescriptor,
	    propertyIsAccessor,
	    getInheritedDescriptor,
	    getInheritedPropertyNames,
	    WeakTwoWayMap,
	}

	// assumes the function opening, body, and closing are on separate lines
	function getFunctionBody( fn ) {
	    const code = fn.toString().split("\n")
	    code.shift() // remove opening line (function() {)
	    code.pop() // remove closing line (})
	    return code.join("\n")
	}

	const descriptorDefaults = {
	    enumerable: true,
	    configurable: true,
	}

	// makes it easier and less verbose to work with descriptors
	function setDescriptor( obj, key, def, inherited = false ) {
	    let descriptor = (
	        inherited ?
	        getInheritedDescriptor( obj, key ) :
	        Object.getOwnPropertyDescriptor( obj, key )
	    )

	    descriptor = descriptor || {}

	    if ( ( def.get || def.set ) && (
	        typeof def.value !== 'undefined' ||
	        typeof def.writable !== 'undefined'
	    )) {
	        throw new TypeError('cannot specify both accessors and a value or writable attribute')
	    }

	    if ( def.get || def.set ) {
	        delete descriptor.value
	        delete descriptor.writable
	    }
	    else if (
	        typeof def.value !== 'undefined' ||
	        typeof def.writable !== 'undefined'
	    ) {
	        delete descriptor.get
	        delete descriptor.set
	    }

	    Object.defineProperty( obj, key,
	        Object.assign( {}, descriptorDefaults, descriptor, def )
	    )
	}

	function propertyIsAccessor( obj, key, inherited = true ) {
	    let result = false
	    let descriptor

	    if ( arguments.length === 1 ) {
	        descriptor = obj
	    }
	    else {
	        descriptor = inherited ?
	            getInheritedDescriptor( obj, key ) :
	            Object.getOwnPropertyDescriptor( obj, key )
	    }

	    if ( descriptor && ( descriptor.get || descriptor.set ) ) result = true

	    return result
	}

	function getInheritedDescriptor( obj, key ) {
	    let currentProto = obj
	    let descriptor

	    while ( currentProto ) {
	        descriptor = Object.getOwnPropertyDescriptor( currentProto, key )
	        if ( descriptor ) return descriptor
	        currentProto = currentProto.__proto__
	    }
	}

	function getInheritedPropertyNames( obj ) {
	    let currentProto = obj
	    let keys = []

	    while ( currentProto ) {
	        keys = keys.concat( Object.getOwnPropertyNames( currentProto ) )
	        currentProto = currentProto.__proto__
	    }

	    // remove duplicates
	    keys = Array.from( new Set( keys ) )

	    return keys
	}


/***/ })
/******/ ]);