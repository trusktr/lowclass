// TODO
//  [x] remove the now-unnecessary modes (leave just what was 'es5' mode)
//  [x] link helpers to each other, making it possible to destructure the arguments to definer functions
//  [x] let access helper prototype objects extend from Object, otherwise common tools are not available.
//  [x] accept a function as return value of function definer, to be treated as a class to derive the definition from, so that it can have access to Protected and Private helpers
//  [x] let the returned class define protected and private getters which return the protected and private definitions.
//  [ ] protected and private static members
//  [ ] no `any` types
//  [ ] other TODOs in the code
import { copyDescriptors, setDefaultStaticDescriptors, setDefaultPrototypeDescriptors, hasPrototype } from './utils.js';
import { Constructor } from './Constructor.js';
import { getFunctionBody, setDescriptor, propertyIsAccessor, WeakTwoWayMap } from './utils.js';
import { getInheritedPropertyNames } from './getInheritedPropertyNames.js';
import { getInheritedDescriptor } from './getInheritedDescriptor.js';
export const staticBlacklist = ['subclass', 'extends', ...Object.getOwnPropertyNames(new Function())];
const publicProtoToProtectedProto = new WeakMap();
const publicProtoToPrivateProto = new WeakMap();
// A two-way map to associate public instances with protected instances.
// There is one protected instance per public instance
const publicToProtected = new WeakTwoWayMap();
// so we can get the class scope associated with a private instance
const privateInstanceToClassScope = new WeakMap();
const brandToPublicPrototypes = new WeakMap();
const brandToProtectedPrototypes = new WeakMap();
const brandToPrivatePrototypes = new WeakMap();
const brandToPublicsPrivates = new WeakMap();
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
};
export class InvalidSuperAccessError extends Error {
}
export class InvalidAccessError extends Error {
}
export const Class = createClassHelper();
export function createClassHelper(options) {
    options = options ? { ...defaultOptions, ...options } : defaultOptions;
    options.defaultClassDescriptor = {
        ...defaultOptions.defaultClassDescriptor,
        ...options.defaultClassDescriptor,
    };
    const { mode, prototypeWritable, setClassDescriptors, nativeNaming } = options;
    function Class(...args) {
        let usingStaticSubclassMethod = false;
        // if called as SomeConstructor.subclass, or bound to SomeConstructor
        if (typeof this === 'function')
            usingStaticSubclassMethod = true;
        // f.e. `Class()`, `Class('Foo')`, `Class('Foo', {...})` , `Class('Foo',
        // {...}, Brand)`, similar to `class {}`, `class Foo {}`, class Foo
        // {...}, and class Foo {...} with branding (see comments on classBrand
        // below regarding positional privacy)
        if (args.length <= 3) {
            let name = '';
            let definer = null;
            let classBrand = null;
            // f.e. `Class('Foo')`
            if (typeof args[0] === 'string')
                name = args[0];
            // f.e. `Class((pub, prot, priv) => ({ ... }))`
            else if (typeof args[0] === 'function' || typeof args[0] === 'object') {
                definer = args[0];
                classBrand = args[1];
            }
            // f.e. `Class('Foo', (pub, prot, priv) => ({ ... }))`
            if (typeof args[1] === 'function' || typeof args[1] === 'object') {
                definer = args[1];
                classBrand = args[2];
            }
            // Make a class in case we wanted to do just `Class()` or
            // `Class('Foo')`...
            const Ctor = usingStaticSubclassMethod
                ? createClass.call(this, name, definer, classBrand)
                : createClass(name, definer, classBrand);
            // ...but add the extends helper in case we wanted to do like:
            // Class().extends(OtherClass, (Public, Protected, Private) => ({
            //   ...
            // }))
            Ctor.extends = function (ParentClass, def, brand) {
                def = def || definer;
                brand = brand || classBrand;
                return createClass.call(ParentClass, name, def, brand);
            };
            return Ctor;
        }
        throw new TypeError('invalid args');
    }
    return Class;
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
    function createClass(className, definer, classBrand) {
        'use strict';
        // f.e. ParentClass.subclass((Public, Protected, Private) => {...})
        let ParentClass = this;
        if (typeof className !== 'string') {
            throw new TypeError(`
                You must specify a string for the 'className' argument.
            `);
        }
        let definition = null;
        // f.e. Class('Foo', { ... })
        if (definer && typeof definer === 'object') {
            definition = definer;
        }
        // Return early if there's no definition or parent class, just a simple
        // extension of Object. f.e. when doing just `Class()` or
        // `Class('Foo')`
        else if (!ParentClass && (!definer || (typeof definer !== 'function' && typeof definer !== 'object'))) {
            let Ctor;
            if (nativeNaming && className)
                Ctor = new Function(`return function ${className}() {}`)();
            else {
                // force anonymous even in ES6+
                Ctor = (() => function () { })();
                if (className)
                    setDescriptor(Ctor, 'name', { value: className });
            }
            Ctor.prototype = { __proto__: Object.prototype, constructor: Ctor };
            // no static inheritance here, just like with `class Foo {}`
            setDescriptor(Ctor, 'subclass', {
                value: Class,
                writable: true, // TODO maybe let's make this non writable
                enumerable: false,
                configurable: false,
            });
            return Ctor;
        }
        // A two-way map to associate public instances with private instances.
        // Unlike publicToProtected, this is inside here because there is one
        // private instance per class scope per instance (or to say it another
        // way, each instance has as many private instances as the number of
        // classes that the given instance has in its inheritance chain, one
        // private instance per class)
        const scopedPublicsToPrivates = classBrand ? void undefined : new WeakTwoWayMap();
        if (classBrand) {
            if (!brandToPublicsPrivates.get(classBrand))
                brandToPublicsPrivates.set(classBrand, new WeakTwoWayMap());
        }
        // if no brand provided, then we use the most fine-grained lexical
        // privacy. Lexical privacy is described at
        // https://github.com/tc39/proposal-class-fields/issues/60
        //
        // TODO make prototypes non-configurable so that the clasds-brand system
        // can't be tricked. For now, it's good enough, most people aren't going
        // to go out of their way to mangle with the prototypes in order to
        // force invalid private access.
        classBrand = classBrand || { brand: 'lexical' };
        // the class "scope" that we will bind to the helper functions
        const scope = {
            className, // convenient for debugging
            get publicToPrivate() {
                return scopedPublicsToPrivates ? scopedPublicsToPrivates : brandToPublicsPrivates.get(classBrand);
            },
            classBrand,
            // we use these to memoize the Public/Protected/Private access
            // helper results, to make subsequent accessses faster.
            cachedPublicAccesses: new WeakMap(),
            cachedProtectedAccesses: new WeakMap(),
            cachedPrivateAccesses: new WeakMap(),
        };
        // create the super helper for this class scope
        const supers = new WeakMap();
        const Super = superHelper.bind(null, supers, scope);
        // bind this class' scope to the helper functions
        const Public = getPublicMembers.bind(null, scope);
        const Protected = getProtectedMembers.bind(null, scope);
        const Private = getPrivateMembers.bind(null, scope);
        Public.prototype = {};
        Protected.prototype = {};
        Private.prototype = {};
        // alows the user to destructure arguments to definer functions
        Public.Public = Public;
        Public.Protected = Protected;
        Public.Private = Private;
        Public.Super = Super;
        Protected.Public = Public;
        Protected.Protected = Protected;
        Protected.Private = Private;
        Protected.Super = Super;
        // Private and Super are never passed as first argument
        // pass the helper functions to the user's class definition function
        definition = definition || (definer && definer(Public, Protected, Private, Super));
        // the user has the option of returning an object that defines which
        // properties are public/protected/private.
        if (definition && typeof definition !== 'object' && typeof definition !== 'function') {
            throw new TypeError(`
                The return value of a class definer function, if any, should be
                an object, or a class constructor.
            `);
        }
        // if a function was returned, we assume it is a class from which we
        // get the public definition from.
        let customClass = null;
        if (typeof definition === 'function') {
            customClass = definition;
            definition = definition.prototype;
            ParentClass = customClass.prototype.__proto__.constructor;
        }
        let staticMembers;
        // if functions were provided for the public/protected/private
        // properties of the definition object, execute them with their
        // respective access helpers, and use the objects returned from them.
        if (definition) {
            staticMembers = definition.static;
            delete definition.static;
            if (typeof definition.public === 'function') {
                definition.public = definition.public(Protected, Private);
            }
            if (typeof definition.protected === 'function') {
                definition.protected = definition.protected(Public, Private);
            }
            if (typeof definition.private === 'function') {
                definition.private = definition.private(Public, Protected);
            }
        }
        ParentClass = ParentClass || Object;
        // extend the parent class
        const parentPublicPrototype = ParentClass.prototype;
        const publicPrototype = (definition && definition.public) || definition || Object.create(parentPublicPrototype);
        if (publicPrototype.__proto__ !== parentPublicPrototype)
            publicPrototype.__proto__ = parentPublicPrototype;
        // extend the parent protected prototype
        const parentProtectedPrototype = getParentProtectedPrototype(parentPublicPrototype);
        const protectedPrototype = (definition && definition.protected) || Object.create(parentProtectedPrototype);
        if (protectedPrototype.__proto__ !== parentProtectedPrototype)
            protectedPrototype.__proto__ = parentProtectedPrototype;
        publicProtoToProtectedProto.set(publicPrototype, protectedPrototype);
        // private prototype inherits from parent, but each private instance is
        // private only for the class of this scope
        const parentPrivatePrototype = getParentPrivatePrototype(parentPublicPrototype);
        const privatePrototype = (definition && definition.private) || Object.create(parentPrivatePrototype);
        if (privatePrototype.__proto__ !== parentPrivatePrototype)
            privatePrototype.__proto__ = parentPrivatePrototype;
        publicProtoToPrivateProto.set(publicPrototype, privatePrototype);
        if (!brandToPublicPrototypes.get(classBrand))
            brandToPublicPrototypes.set(classBrand, new Set());
        if (!brandToProtectedPrototypes.get(classBrand))
            brandToProtectedPrototypes.set(classBrand, new Set());
        if (!brandToPrivatePrototypes.get(classBrand))
            brandToPrivatePrototypes.set(classBrand, new Set());
        brandToPublicPrototypes.get(classBrand).add(publicPrototype);
        brandToProtectedPrototypes.get(classBrand).add(protectedPrototype);
        brandToPrivatePrototypes.get(classBrand).add(privatePrototype);
        scope.publicPrototype = publicPrototype;
        scope.privatePrototype = privatePrototype;
        scope.protectedPrototype = protectedPrototype;
        scope.parentPublicPrototype = parentPublicPrototype;
        scope.parentProtectedPrototype = parentProtectedPrototype;
        scope.parentPrivatePrototype = parentPrivatePrototype;
        // the user has the option of assigning methods and properties to the
        // helpers that we passed in, to let us know which methods and
        // properties are public/protected/private so we can assign them onto
        // the respective prototypes.
        copyDescriptors(Public.prototype, publicPrototype);
        copyDescriptors(Protected.prototype, protectedPrototype);
        copyDescriptors(Private.prototype, privatePrototype);
        if (definition) {
            // delete these so we don't expose them on the class' public
            // prototype
            delete definition.public;
            delete definition.protected;
            delete definition.private;
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
                copyDescriptors(definition, publicPrototype);
            }
        }
        if (customClass) {
            if (staticMembers)
                copyDescriptors(staticMembers, customClass);
            return customClass;
        }
        const userConstructor = publicPrototype.hasOwnProperty('constructor') ? publicPrototype.constructor : null;
        let NewClass;
        let newPrototype = null;
        // ES5 version (which seems to be so much better)
        if (mode === 'es5') {
            NewClass = (() => function () {
                let ret = null;
                let constructor = null;
                if (userConstructor)
                    constructor = userConstructor;
                else
                    constructor = ParentClass;
                // Object is a special case because otherwise
                // `Object.apply(this)` returns a different object and we don't
                // want to deal with return value in that case
                if (constructor !== Object)
                    ret = constructor.apply(this, arguments);
                if (ret && (typeof ret === 'object' || typeof ret === 'function')) {
                    // XXX should we set ret.__proto__ = constructor.prototype
                    // here? Or let the user deal with that?
                    return ret;
                }
                return this;
            })();
            newPrototype = publicPrototype;
        }
        else {
            throw new TypeError(`
                The lowclass "mode" option can only be 'es5' for now.
            `);
        }
        if (className) {
            if (nativeNaming) {
                const code = getFunctionBody(NewClass);
                const proto = NewClass.prototype;
                NewClass = new Function(` userConstructor, ParentClass `, `
                    return function ${className}() { ${code} }
                `)(userConstructor, ParentClass);
                NewClass.prototype = proto;
            }
            else {
                setDescriptor(NewClass, 'name', { value: className });
            }
        }
        if (userConstructor && userConstructor.length) {
            // length is not writable, only configurable, therefore the value
            // has to be set with a descriptor update
            setDescriptor(NewClass, 'length', {
                value: userConstructor.length,
            });
        }
        // static stuff {
        // static inheritance
        NewClass.__proto__ = ParentClass;
        if (staticMembers)
            copyDescriptors(staticMembers, NewClass);
        // allow users to make subclasses. When subclass is called on a
        // constructor, it defines `this` which is assigned to ParentClass
        // above.
        setDescriptor(NewClass, 'subclass', {
            value: Class,
            writable: true,
            enumerable: false,
            configurable: false,
        });
        // }
        // prototype stuff {
        NewClass.prototype = newPrototype;
        NewClass.prototype.constructor = NewClass;
        // }
        if (setClassDescriptors) {
            setDefaultStaticDescriptors(NewClass, options, staticBlacklist);
            setDescriptor(NewClass, 'prototype', { writable: prototypeWritable });
            setDefaultPrototypeDescriptors(NewClass.prototype, options);
            setDefaultPrototypeDescriptors(protectedPrototype, options);
            setDefaultPrototypeDescriptors(privatePrototype, options);
        }
        scope.constructor = NewClass; // convenient for debugging
        return NewClass;
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
function getParentProtectedPrototype(parentPublicPrototype) {
    // look up the prototype chain until we find a parent protected prototype, if any.
    let parentProtectedProto;
    let currentPublicProto = parentPublicPrototype;
    while (currentPublicProto && !parentProtectedProto) {
        parentProtectedProto = publicProtoToProtectedProto.get(currentPublicProto);
        currentPublicProto = currentPublicProto.__proto__;
    }
    // TODO, now that we're finding the nearest parent protected proto,
    // we might not need to create an empty object for each class if we
    // don't find one, to avoid prototype lookup depth, as we'll connect
    // to the nearest one we find, if any.
    return parentProtectedProto || {};
}
function getParentPrivatePrototype(parentPublicPrototype) {
    // look up the prototype chain until we find a parent protected prototype, if any.
    let parentPrivateProto;
    let currentPublicProto = parentPublicPrototype;
    while (currentPublicProto && !parentPrivateProto) {
        parentPrivateProto = publicProtoToPrivateProto.get(currentPublicProto);
        currentPublicProto = currentPublicProto.__proto__;
    }
    // TODO, now that we're finding the nearest parent protected proto,
    // we might not need to create an empty object for each class if we
    // don't find one, to avoid prototype lookup depth, as we'll connect
    // to the nearest one we find, if any.
    return parentPrivateProto || {};
}
function getPublicMembers(scope, instance) {
    let result = scope.cachedPublicAccesses.get(instance);
    if (result)
        return result;
    // check only for the private instance of this class scope
    if (isPrivateInstance(scope, instance))
        scope.cachedPublicAccesses.set(instance, (result = getSubclassScope(instance).publicToPrivate.get(instance)));
    // check for an instance of the class (or its subclasses) of this scope
    else if (isProtectedInstance(scope, instance))
        scope.cachedPublicAccesses.set(instance, (result = publicToProtected.get(instance)));
    // otherwise just return whatever was passed in, it's public already!
    else
        scope.cachedPublicAccesses.set(instance, (result = instance));
    return result;
}
function getProtectedMembers(scope, instance) {
    let result = scope.cachedProtectedAccesses.get(instance);
    if (result)
        return result;
    // check for an instance of the class (or its subclasses) of this scope
    // This allows for example an instance of an Animal base class to access
    // protected members of an instance of a Dog child class.
    if (isPublicInstance(scope, instance))
        scope.cachedProtectedAccesses.set(instance, (result = publicToProtected.get(instance) || createProtectedInstance(instance)));
    // check for a private instance inheriting from this class scope
    else if (isPrivateInstance(scope, instance)) {
        const publicInstance = getSubclassScope(instance).publicToPrivate.get(instance);
        scope.cachedProtectedAccesses.set(instance, (result = publicToProtected.get(publicInstance) || createProtectedInstance(publicInstance)));
    }
    // return the protected instance if it was passed in
    else if (isProtectedInstance(scope, instance))
        scope.cachedProtectedAccesses.set(instance, (result = instance));
    if (!result)
        throw new InvalidAccessError('invalid access of protected member');
    return result;
}
function getSubclassScope(privateInstance) {
    return privateInstanceToClassScope.get(privateInstance);
}
function createProtectedInstance(publicInstance) {
    // traverse instance proto chain, find first protected prototype
    const protectedPrototype = findLeafmostProtectedPrototype(publicInstance);
    // make the protected instance from the found protected prototype
    const protectedInstance = Object.create(protectedPrototype);
    publicToProtected.set(publicInstance, protectedInstance);
    return protectedInstance;
}
function findLeafmostProtectedPrototype(publicInstance) {
    let result = null;
    let currentProto = publicInstance.__proto__;
    while (currentProto) {
        result = publicProtoToProtectedProto.get(currentProto);
        if (result)
            return result;
        currentProto = currentProto.__proto__;
    }
    return result;
}
function getPrivateMembers(scope, instance) {
    let result = scope.cachedPrivateAccesses.get(instance);
    if (result)
        return result;
    // check for a public instance that is or inherits from this class
    if (isPublicInstance(scope, instance))
        scope.cachedPrivateAccesses.set(instance, (result = scope.publicToPrivate.get(instance) || createPrivateInstance(scope, instance)));
    // check for a protected instance that is or inherits from this class'
    // protectedPrototype
    else if (isProtectedInstance(scope, instance)) {
        const publicInstance = publicToProtected.get(instance);
        scope.cachedPrivateAccesses.set(instance, (result = scope.publicToPrivate.get(publicInstance) || createPrivateInstance(scope, publicInstance)));
    }
    // return the private instance if it was passed in
    else if (isPrivateInstance(scope, instance))
        scope.cachedPrivateAccesses.set(instance, (result = instance));
    if (!result)
        throw new InvalidAccessError('invalid access of private member');
    return result;
}
function createPrivateInstance(scope, publicInstance) {
    const privateInstance = Object.create(scope.privatePrototype);
    scope.publicToPrivate.set(publicInstance, privateInstance);
    privateInstanceToClassScope.set(privateInstance, scope); // TODO use WeakTwoWayMap
    return privateInstance;
}
function isPublicInstance(scope, instance, brandedCheck = true) {
    if (!brandedCheck)
        return hasPrototype(instance, scope.publicPrototype);
    for (const proto of Array.from(brandToPublicPrototypes.get(scope.classBrand))) {
        if (hasPrototype(instance, proto))
            return true;
    }
    return false;
}
function isProtectedInstance(scope, instance, brandedCheck = true) {
    if (!brandedCheck)
        return hasPrototype(instance, scope.protectedPrototype);
    for (const proto of Array.from(brandToProtectedPrototypes.get(scope.classBrand))) {
        if (hasPrototype(instance, proto))
            return true;
    }
    return false;
}
function isPrivateInstance(scope, instance, brandedCheck = true) {
    if (!brandedCheck)
        return hasPrototype(instance, scope.privatePrototype);
    for (const proto of Array.from(brandToPrivatePrototypes.get(scope.classBrand))) {
        if (hasPrototype(instance, proto))
            return true;
    }
    return false;
}
function superHelper(supers, scope, instance) {
    const { parentPublicPrototype, parentProtectedPrototype, parentPrivatePrototype } = scope;
    if (isPublicInstance(scope, instance, false))
        return getSuperHelperObject(instance, parentPublicPrototype, supers);
    if (isProtectedInstance(scope, instance, false))
        return getSuperHelperObject(instance, parentProtectedPrototype, supers);
    if (isPrivateInstance(scope, instance, false))
        return getSuperHelperObject(instance, parentPrivatePrototype, supers);
    throw new InvalidSuperAccessError('invalid super access');
}
function getSuperHelperObject(instance, parentPrototype, supers) {
    let _super = supers.get(instance);
    // XXX PERFORMANCE: there's probably some ways to improve speed here using caching
    if (!_super) {
        supers.set(instance, (_super = Object.create(parentPrototype)));
        const keys = getInheritedPropertyNames(parentPrototype);
        let i = keys.length;
        while (i--) {
            const key = keys[i];
            setDescriptor(_super, key, {
                get: function () {
                    let value = void undefined;
                    const descriptor = getInheritedDescriptor(parentPrototype, key);
                    if (descriptor && propertyIsAccessor(descriptor)) {
                        const getter = descriptor.get;
                        if (getter)
                            value = getter.call(instance);
                    }
                    else {
                        value = parentPrototype[key];
                    }
                    if (value && value.call && typeof value === 'function') {
                        value = value.bind(instance);
                    }
                    return value;
                },
                // like native `super`, setting a super property does nothing.
                set: function (value) {
                    const descriptor = getInheritedDescriptor(parentPrototype, key);
                    if (descriptor && propertyIsAccessor(descriptor)) {
                        const setter = descriptor.set;
                        if (setter)
                            value = setter.call(instance, value);
                    }
                    else {
                        // just like native `super`
                        instance[key] = value;
                    }
                },
            }, true);
        }
    }
    return _super;
}
//# sourceMappingURL=Class.js.map