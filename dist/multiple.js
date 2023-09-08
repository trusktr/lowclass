var ImplementationMethod;
(function (ImplementationMethod) {
    ImplementationMethod["PROXIES_ON_INSTANCE_AND_PROTOTYPE"] = "PROXIES_ON_INSTANCE_AND_PROTOTYPE";
    ImplementationMethod["PROXIES_ON_PROTOTYPE"] = "PROXIES_ON_PROTOTYPE";
    ImplementationMethod["PROXY_AFTER_INSTANCE_AND_PROTOTYPE"] = "PROXY_AFTER_INSTANCE_AND_PROTOTYPE";
})(ImplementationMethod || (ImplementationMethod = {}));
export function makeMultipleHelper(options) {
    return function multiple(...classes) {
        const mode = (options && options.method) || ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE;
        switch (mode) {
            case ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE: {
                return withProxiesOnThisAndPrototype(...classes);
            }
            case ImplementationMethod.PROXIES_ON_PROTOTYPE: {
                return withProxiesOnPrototype(...classes);
            }
            case ImplementationMethod.PROXY_AFTER_INSTANCE_AND_PROTOTYPE: {
                throw new Error(' not implemented yet');
            }
        }
    };
}
export const multiple = makeMultipleHelper({ method: ImplementationMethod.PROXIES_ON_INSTANCE_AND_PROTOTYPE });
function withProxiesOnThisAndPrototype(...classes) {
    if (classes.length === 0)
        return Object;
    if (classes.length === 1)
        return classes[0];
    const FirstClass = classes.shift();
    class MultiClass extends FirstClass {
        constructor(...args) {
            super(...args);
            const instances = [];
            let Ctor;
            for (let i = 0, l = classes.length; i < l; i += 1) {
                Ctor = classes[i];
                const instance = Reflect.construct(Ctor, args);
                instances.push(instance);
            }
            return new Proxy(this, {
                get(target, key, self) {
                    if (Reflect.ownKeys(target).includes(key))
                        return Reflect.get(target, key, self);
                    let instance;
                    for (let i = 0, l = instances.length; i < l; i += 1) {
                        instance = instances[i];
                        if (Reflect.ownKeys(instance).includes(key))
                            return Reflect.get(instance, key, self);
                    }
                    const proto = Object.getPrototypeOf(self);
                    if (Reflect.has(proto, key))
                        return Reflect.get(proto, key, self);
                    return undefined;
                },
                ownKeys(target) {
                    let keys = Reflect.ownKeys(target);
                    let instance;
                    let instanceKeys;
                    for (let i = 0, l = instances.length; i < l; i += 1) {
                        instance = instances[i];
                        instanceKeys = Reflect.ownKeys(instance);
                        for (let j = 0, l = instanceKeys.length; j < l; j += 1)
                            keys.push(instanceKeys[j]);
                    }
                    return keys;
                },
                has(target, key) {
                    if (Reflect.ownKeys(target).includes(key))
                        return true;
                    let instance;
                    for (let i = 0, l = instances.length; i < l; i += 1) {
                        instance = instances[i];
                        if (Reflect.ownKeys(instance).includes(key))
                            return true;
                    }
                    const proto = Object.getPrototypeOf(self);
                    if (Reflect.has(proto, key))
                        return true;
                    return false;
                },
            });
        }
    }
    const newMultiClassPrototype = new Proxy(Object.create(FirstClass.prototype), {
        get(target, key, self) {
            if (Reflect.has(target, key))
                return Reflect.get(target, key, self);
            let Class;
            for (let i = 0, l = classes.length; i < l; i += 1) {
                Class = classes[i];
                if (Reflect.has(Class.prototype, key))
                    return Reflect.get(Class.prototype, key, self);
            }
        },
        has(target, key) {
            if (Reflect.has(target, key))
                return true;
            let Class;
            for (let i = 0, l = classes.length; i < l; i += 1) {
                Class = classes[i];
                if (Reflect.has(Class.prototype, key))
                    return true;
            }
            return false;
        },
    });
    Object.setPrototypeOf(MultiClass.prototype, newMultiClassPrototype);
    return MultiClass;
}
let currentSelf = [];
const __instances__ = new WeakMap();
const getInstances = (inst) => {
    let result = __instances__.get(inst);
    if (!result)
        __instances__.set(inst, (result = []));
    return result;
};
const getResult = { has: false, value: undefined };
function getFromInstance(instance, key, result) {
    result.has = false;
    result.value = undefined;
    if (Reflect.ownKeys(instance).includes(key)) {
        result.has = true;
        result.value = Reflect.get(instance, key);
        return;
    }
    const instances = __instances__.get(instance);
    if (!instances)
        return;
    for (const instance of instances) {
        getFromInstance(instance, key, result);
        if (result.has)
            return;
    }
}
let shouldGetFromPrototype = false;
let topLevelMultiClassPrototype = null;
function withProxiesOnPrototype(...classes) {
    if (classes.length === 0)
        return Object;
    if (classes.length === 1)
        return classes[0];
    const FirstClass = classes.shift();
    class MultiClass extends FirstClass {
        constructor(...args) {
            super(...args);
            const instances = getInstances(this);
            for (const Ctor of classes) {
                const instance = Reflect.construct(Ctor, args);
                instances.push(instance);
            }
        }
    }
    const newMultiClassPrototype = new Proxy(Object.create(FirstClass.prototype), {
        get(target, key, self) {
            if (!topLevelMultiClassPrototype)
                topLevelMultiClassPrototype = target;
            if (!shouldGetFromPrototype) {
                getFromInstance(self, key, getResult);
                if (getResult.has) {
                    topLevelMultiClassPrototype = null;
                    return getResult.value;
                }
                shouldGetFromPrototype = true;
            }
            if (shouldGetFromPrototype) {
                let result = undefined;
                if (Reflect.has(target, key))
                    result = Reflect.get(target, key, self);
                let Class;
                for (let i = 0, l = classes.length; i < l; i += 1) {
                    Class = classes[i];
                    if (Reflect.has(Class.prototype, key))
                        result = Reflect.get(Class.prototype, key, self);
                }
                if (topLevelMultiClassPrototype === target) {
                    topLevelMultiClassPrototype = null;
                    shouldGetFromPrototype = false;
                }
                return result;
            }
        },
        set(target, key, value, self) {
            currentSelf.push(self);
            if (Reflect.has(target, key)) {
                currentSelf.pop();
                return Reflect.set(target, key, value, self);
            }
            currentSelf.pop();
            for (const instance of getInstances(self)) {
                currentSelf.push(instance);
                if (Reflect.has(instance, key)) {
                    currentSelf.pop();
                    return Reflect.set(instance, key, value, instance);
                }
                currentSelf.pop();
            }
            return Reflect.set(target, key, value, self);
        },
        has(target, key) {
            if (Reflect.has(target, key))
                return true;
            let Class;
            for (let i = 0, l = classes.length; i < l; i += 1) {
                Class = classes[i];
                if (Reflect.has(Class.prototype, key))
                    return true;
            }
            return false;
        },
    });
    Object.setPrototypeOf(MultiClass.prototype, newMultiClassPrototype);
    return MultiClass;
}
//# sourceMappingURL=multiple.js.map