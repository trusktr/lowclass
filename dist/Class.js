import { Constructor, copyDescriptors, setDefaultStaticDescriptors, setDefaultPrototypeDescriptors, hasPrototype, } from './utils.js';
import { getFunctionBody, setDescriptor, propertyIsAccessor, getInheritedDescriptor, getInheritedPropertyNames, WeakTwoWayMap, } from './utils.js';
export const staticBlacklist = ['subclass', 'extends', ...Object.getOwnPropertyNames(new Function())];
const publicProtoToProtectedProto = new WeakMap();
const publicProtoToPrivateProto = new WeakMap();
const publicToProtected = new WeakTwoWayMap();
const privateInstanceToClassScope = new WeakMap();
const brandToPublicPrototypes = new WeakMap();
const brandToProtectedPrototypes = new WeakMap();
const brandToPrivatePrototypes = new WeakMap();
const brandToPublicsPrivates = new WeakMap();
const defaultOptions = {
    mode: 'es5',
    nativeNaming: false,
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
        if (typeof this === 'function')
            usingStaticSubclassMethod = true;
        if (args.length <= 3) {
            let name = '';
            let definer = null;
            let classBrand = null;
            if (typeof args[0] === 'string')
                name = args[0];
            else if (typeof args[0] === 'function' || typeof args[0] === 'object') {
                definer = args[0];
                classBrand = args[1];
            }
            if (typeof args[1] === 'function' || typeof args[1] === 'object') {
                definer = args[1];
                classBrand = args[2];
            }
            const Ctor = usingStaticSubclassMethod
                ? createClass.call(this, name, definer, classBrand)
                : createClass(name, definer, classBrand);
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
    function createClass(className, definer, classBrand) {
        'use strict';
        let ParentClass = this;
        if (typeof className !== 'string') {
            throw new TypeError(`
                You must specify a string for the 'className' argument.
            `);
        }
        let definition = null;
        if (definer && typeof definer === 'object') {
            definition = definer;
        }
        else if (!ParentClass && (!definer || (typeof definer !== 'function' && typeof definer !== 'object'))) {
            let Ctor;
            if (nativeNaming && className)
                Ctor = new Function(`return function ${className}() {}`)();
            else {
                Ctor = (() => function () { })();
                if (className)
                    setDescriptor(Ctor, 'name', { value: className });
            }
            Ctor.prototype = { __proto__: Object.prototype, constructor: Ctor };
            setDescriptor(Ctor, 'subclass', {
                value: Class,
                writable: true,
                enumerable: false,
                configurable: false,
            });
            return Ctor;
        }
        const scopedPublicsToPrivates = classBrand ? void undefined : new WeakTwoWayMap();
        if (classBrand) {
            if (!brandToPublicsPrivates.get(classBrand))
                brandToPublicsPrivates.set(classBrand, new WeakTwoWayMap());
        }
        classBrand = classBrand || { brand: 'lexical' };
        const scope = {
            className,
            get publicToPrivate() {
                return scopedPublicsToPrivates ? scopedPublicsToPrivates : brandToPublicsPrivates.get(classBrand);
            },
            classBrand,
            cachedPublicAccesses: new WeakMap(),
            cachedProtectedAccesses: new WeakMap(),
            cachedPrivateAccesses: new WeakMap(),
        };
        const supers = new WeakMap();
        const Super = superHelper.bind(null, supers, scope);
        const Public = getPublicMembers.bind(null, scope);
        const Protected = getProtectedMembers.bind(null, scope);
        const Private = getPrivateMembers.bind(null, scope);
        Public.prototype = {};
        Protected.prototype = {};
        Private.prototype = {};
        Public.Public = Public;
        Public.Protected = Protected;
        Public.Private = Private;
        Public.Super = Super;
        Protected.Public = Public;
        Protected.Protected = Protected;
        Protected.Private = Private;
        Protected.Super = Super;
        definition = definition || (definer && definer(Public, Protected, Private, Super));
        if (definition && typeof definition !== 'object' && typeof definition !== 'function') {
            throw new TypeError(`
                The return value of a class definer function, if any, should be
                an object, or a class constructor.
            `);
        }
        let customClass = null;
        if (typeof definition === 'function') {
            customClass = definition;
            definition = definition.prototype;
            ParentClass = customClass.prototype.__proto__.constructor;
        }
        let staticMembers;
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
        const parentPublicPrototype = ParentClass.prototype;
        const publicPrototype = (definition && definition.public) || definition || Object.create(parentPublicPrototype);
        if (publicPrototype.__proto__ !== parentPublicPrototype)
            publicPrototype.__proto__ = parentPublicPrototype;
        const parentProtectedPrototype = getParentProtectedPrototype(parentPublicPrototype);
        const protectedPrototype = (definition && definition.protected) || Object.create(parentProtectedPrototype);
        if (protectedPrototype.__proto__ !== parentProtectedPrototype)
            protectedPrototype.__proto__ = parentProtectedPrototype;
        publicProtoToProtectedProto.set(publicPrototype, protectedPrototype);
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
        copyDescriptors(Public.prototype, publicPrototype);
        copyDescriptors(Protected.prototype, protectedPrototype);
        copyDescriptors(Private.prototype, privatePrototype);
        if (definition) {
            delete definition.public;
            delete definition.protected;
            delete definition.private;
            if (definition !== publicPrototype) {
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
        if (mode === 'es5') {
            NewClass = (() => function () {
                let ret = null;
                let constructor = null;
                if (userConstructor)
                    constructor = userConstructor;
                else
                    constructor = ParentClass;
                if (constructor !== Object)
                    ret = constructor.apply(this, arguments);
                if (ret && (typeof ret === 'object' || typeof ret === 'function')) {
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
            setDescriptor(NewClass, 'length', {
                value: userConstructor.length,
            });
        }
        NewClass.__proto__ = ParentClass;
        if (staticMembers)
            copyDescriptors(staticMembers, NewClass);
        setDescriptor(NewClass, 'subclass', {
            value: Class,
            writable: true,
            enumerable: false,
            configurable: false,
        });
        NewClass.prototype = newPrototype;
        NewClass.prototype.constructor = NewClass;
        if (setClassDescriptors) {
            setDefaultStaticDescriptors(NewClass, options, staticBlacklist);
            setDescriptor(NewClass, 'prototype', { writable: prototypeWritable });
            setDefaultPrototypeDescriptors(NewClass.prototype, options);
            setDefaultPrototypeDescriptors(protectedPrototype, options);
            setDefaultPrototypeDescriptors(privatePrototype, options);
        }
        scope.constructor = NewClass;
        return NewClass;
    }
}
function getParentProtectedPrototype(parentPublicPrototype) {
    let parentProtectedProto;
    let currentPublicProto = parentPublicPrototype;
    while (currentPublicProto && !parentProtectedProto) {
        parentProtectedProto = publicProtoToProtectedProto.get(currentPublicProto);
        currentPublicProto = currentPublicProto.__proto__;
    }
    return parentProtectedProto || {};
}
function getParentPrivatePrototype(parentPublicPrototype) {
    let parentPrivateProto;
    let currentPublicProto = parentPublicPrototype;
    while (currentPublicProto && !parentPrivateProto) {
        parentPrivateProto = publicProtoToPrivateProto.get(currentPublicProto);
        currentPublicProto = currentPublicProto.__proto__;
    }
    return parentPrivateProto || {};
}
function getPublicMembers(scope, instance) {
    let result = scope.cachedPublicAccesses.get(instance);
    if (result)
        return result;
    if (isPrivateInstance(scope, instance))
        scope.cachedPublicAccesses.set(instance, (result = getSubclassScope(instance).publicToPrivate.get(instance)));
    else if (isProtectedInstance(scope, instance))
        scope.cachedPublicAccesses.set(instance, (result = publicToProtected.get(instance)));
    else
        scope.cachedPublicAccesses.set(instance, (result = instance));
    return result;
}
function getProtectedMembers(scope, instance) {
    let result = scope.cachedProtectedAccesses.get(instance);
    if (result)
        return result;
    if (isPublicInstance(scope, instance))
        scope.cachedProtectedAccesses.set(instance, (result = publicToProtected.get(instance) || createProtectedInstance(instance)));
    else if (isPrivateInstance(scope, instance)) {
        const publicInstance = getSubclassScope(instance).publicToPrivate.get(instance);
        scope.cachedProtectedAccesses.set(instance, (result = publicToProtected.get(publicInstance) || createProtectedInstance(publicInstance)));
    }
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
    const protectedPrototype = findLeafmostProtectedPrototype(publicInstance);
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
    if (isPublicInstance(scope, instance))
        scope.cachedPrivateAccesses.set(instance, (result = scope.publicToPrivate.get(instance) || createPrivateInstance(scope, instance)));
    else if (isProtectedInstance(scope, instance)) {
        const publicInstance = publicToProtected.get(instance);
        scope.cachedPrivateAccesses.set(instance, (result = scope.publicToPrivate.get(publicInstance) || createPrivateInstance(scope, publicInstance)));
    }
    else if (isPrivateInstance(scope, instance))
        scope.cachedPrivateAccesses.set(instance, (result = instance));
    if (!result)
        throw new InvalidAccessError('invalid access of private member');
    return result;
}
function createPrivateInstance(scope, publicInstance) {
    const privateInstance = Object.create(scope.privatePrototype);
    scope.publicToPrivate.set(publicInstance, privateInstance);
    privateInstanceToClassScope.set(privateInstance, scope);
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
                set: function (value) {
                    const descriptor = getInheritedDescriptor(parentPrototype, key);
                    if (descriptor && propertyIsAccessor(descriptor)) {
                        const setter = descriptor.set;
                        if (setter)
                            value = setter.call(instance, value);
                    }
                    else {
                        instance[key] = value;
                    }
                },
            }, true);
        }
    }
    return _super;
}
export default Class;
//# sourceMappingURL=Class.js.map