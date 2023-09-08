import Class from './Class.js';
export function Mixin(mixinFn, DefaultBase) {
    mixinFn = Cached(mixinFn);
    mixinFn = HasInstance(mixinFn);
    mixinFn = Dedupe(mixinFn);
    mixinFn = WithDefault(mixinFn, DefaultBase || Class());
    mixinFn = ApplyDefault(mixinFn);
    return mixinFn();
}
export default Mixin;
export { WithDefault, Cached, HasInstance, ApplyDefault, Dedupe };
function WithDefault(classFactory, Default) {
    return named(classFactory.name, (Base) => {
        Base = Base || Default;
        return classFactory(Base);
    });
}
function Cached(classFactory) {
    const classCache = new WeakMap();
    return named(classFactory.name, (Base) => {
        let Class = classCache.get(Base);
        if (!Class) {
            classCache.set(Base, (Class = classFactory(Base)));
        }
        return Class;
    });
}
function HasInstance(classFactory) {
    let instanceofSymbol;
    return named(classFactory.name, (Base) => {
        const Class = classFactory(Base);
        if (typeof Symbol === 'undefined' || !Symbol.hasInstance)
            return Class;
        if (Object.getOwnPropertySymbols(Class).includes(Symbol.hasInstance))
            return Class;
        if (!instanceofSymbol)
            instanceofSymbol = Symbol('instanceofSymbol');
        Class[instanceofSymbol] = true;
        Object.defineProperty(Class, Symbol.hasInstance, {
            value: function hasInstance(obj) {
                if (this !== Class)
                    return Class.__proto__[Symbol.hasInstance].call(this, obj);
                let currentProto = obj;
                while (currentProto) {
                    const descriptor = Object.getOwnPropertyDescriptor(currentProto, 'constructor');
                    if (descriptor && descriptor.value && descriptor.value.hasOwnProperty(instanceofSymbol))
                        return true;
                    currentProto = currentProto.__proto__;
                }
                return false;
            },
        });
        return Class;
    });
}
function ApplyDefault(classFactory) {
    const DefaultClass = classFactory();
    DefaultClass.mixin = classFactory;
    return classFactory;
}
function Dedupe(classFactory) {
    const map = new WeakMap();
    return named(classFactory.name, (Base) => {
        if (hasMixin(Base, classFactory, map))
            return Base;
        const Class = classFactory(Base);
        map.set(Class, classFactory);
        return Class;
    });
}
function hasMixin(Class, mixin, map) {
    while (Class) {
        if (map.get(Class) === mixin)
            return true;
        Class = Class.__proto__;
    }
    return false;
}
function named(name, func) {
    try {
        Object.defineProperty(func, 'name', {
            ...Object.getOwnPropertyDescriptor(func, 'name'),
            value: name,
        });
    }
    catch (e) {
    }
    return func;
}
//# sourceMappingURL=Mixin.js.map