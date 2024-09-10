export declare class WeakTwoWayMap {
    m: WeakMap<WeakKey, any>;
    set(a: Object, b: Object): void;
    get(item: Object): any;
    has(item: Object): boolean;
}
export declare function getFunctionBody(fn: Function): string;
export declare function setDescriptor<T extends {}>(obj: T, key: keyof T, newDescriptor: PropertyDescriptor, inherited?: boolean): void;
export declare function setDescriptors(obj: Object, newDescriptors: Record<string, PropertyDescriptor>): void;
export declare function propertyIsAccessor<T extends Object | PropertyDescriptor>(obj: T, key?: keyof T, inherited?: boolean): boolean;
/** Check if an object has the given prototype in its chain. */
export declare function hasPrototype(obj: any, proto: any): boolean;
/** Copy all properties (as descriptors) from source to destination. */
export declare function copyDescriptors(source: Object, destination: Object, mod?: any): void;
export declare function setDefaultPrototypeDescriptors(prototype: Object, { defaultClassDescriptor: { writable, enumerable, configurable } }: any): void;
export declare function setDefaultStaticDescriptors(Ctor: any, { defaultClassDescriptor: { writable, enumerable, configurable } }: any, staticBlacklist?: (string | symbol)[]): void;
//# sourceMappingURL=utils.d.ts.map