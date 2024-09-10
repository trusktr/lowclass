// TODO no any
import { getInheritedDescriptor } from './getInheritedDescriptor.js';
export class WeakTwoWayMap {
    m = new WeakMap();
    set(a, b) {
        this.m.set(a, b);
        this.m.set(b, a);
    }
    get(item) {
        return this.m.get(item);
    }
    has(item) {
        return this.m.has(item);
    }
}
// assumes the function opening, body, and closing are on separate lines
export function getFunctionBody(fn) {
    const code = fn.toString().split('\n');
    code.shift(); // remove opening line (function() {)
    code.pop(); // remove closing line (})
    return code.join('\n');
}
const descriptorDefaults = {
    enumerable: true,
    configurable: true,
};
// makes it easier and less verbose to work with descriptors
export function setDescriptor(obj, key, newDescriptor, inherited = false) {
    let currentDescriptor = inherited ? getInheritedDescriptor(obj, key) : Object.getOwnPropertyDescriptor(obj, key);
    newDescriptor = overrideDescriptor(currentDescriptor, newDescriptor);
    Object.defineProperty(obj, key, newDescriptor);
}
export function setDescriptors(obj, newDescriptors) {
    let newDescriptor;
    let currentDescriptor;
    const currentDescriptors = Object.getOwnPropertyDescriptors(obj);
    for (const key in newDescriptors) {
        newDescriptor = newDescriptors[key];
        currentDescriptor = currentDescriptors[key];
        newDescriptors[key] = overrideDescriptor(currentDescriptor, newDescriptor);
    }
    Object.defineProperties(obj, newDescriptors);
}
function overrideDescriptor(oldDescriptor, newDescriptor) {
    if (('get' in newDescriptor || 'set' in newDescriptor) &&
        ('value' in newDescriptor || 'writable' in newDescriptor)) {
        throw new TypeError('cannot specify both accessors and a value or writable attribute');
    }
    if (oldDescriptor) {
        if ('get' in newDescriptor || 'set' in newDescriptor) {
            delete oldDescriptor.value;
            delete oldDescriptor.writable;
        }
        else if ('value' in newDescriptor || 'writable' in newDescriptor) {
            delete oldDescriptor.get;
            delete oldDescriptor.set;
        }
    }
    return { ...descriptorDefaults, ...oldDescriptor, ...newDescriptor };
}
// TODO use signature override
export function propertyIsAccessor(obj, key, inherited = true) {
    let result = false;
    let descriptor;
    if (arguments.length === 1) {
        descriptor = obj;
    }
    else {
        descriptor = inherited ? getInheritedDescriptor(obj, key) : Object.getOwnPropertyDescriptor(obj, key);
    }
    if (descriptor && (descriptor.get || descriptor.set))
        result = true;
    return result;
}
/** Check if an object has the given prototype in its chain. */
export function hasPrototype(obj, proto) {
    let currentProto = obj.__proto__;
    do {
        if (proto === currentProto)
            return true;
        currentProto = currentProto.__proto__;
    } while (currentProto);
    return false;
}
/** Copy all properties (as descriptors) from source to destination. */
export function copyDescriptors(source, destination, mod) {
    const props = Object.getOwnPropertyNames(source);
    let i = props.length;
    while (i--) {
        const prop = props[i];
        const descriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (mod)
            mod(descriptor);
        Object.defineProperty(destination, prop, descriptor);
    }
}
export function setDefaultPrototypeDescriptors(prototype, { defaultClassDescriptor: { writable, enumerable, configurable } }) {
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
    let descriptor;
    for (const key in descriptors) {
        descriptor = descriptors[key];
        // regular value
        if ('value' in descriptor || 'writable' in descriptor) {
            descriptor.writable = writable;
        }
        // accessor or regular value
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
    }
    setDescriptors(prototype, descriptors);
}
export function setDefaultStaticDescriptors(Ctor, { defaultClassDescriptor: { writable, enumerable, configurable } }, staticBlacklist) {
    const descriptors = Object.getOwnPropertyDescriptors(Ctor);
    let descriptor;
    for (const key in descriptors) {
        if (staticBlacklist && staticBlacklist.includes(key)) {
            delete descriptors[key];
            continue;
        }
        descriptor = descriptors[key];
        // regular value
        if ('value' in descriptor || 'writable' in descriptor) {
            descriptor.writable = writable;
        }
        // accessor or regular value
        descriptor.enumerable = enumerable;
        descriptor.configurable = configurable;
    }
    setDescriptors(Ctor, descriptors);
}
//# sourceMappingURL=utils.js.map