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
interface DescriptorWithOwner extends PropertyDescriptor {
    owner: object;
}
export declare function getInheritedDescriptor<T extends object>(obj: T, key: keyof T): DescriptorWithOwner | undefined;
export declare function getInheritedPropertyNames<T extends object>(obj: T): (keyof T)[];
export type Constructor<T = object, A extends any[] = any[], Static = {}> = (new (...a: A) => T) & Static;
export declare function Constructor<T = object, Static = {}>(Ctor: Constructor<any>): Constructor<T> & Static;
export declare function hasPrototype(obj: any, proto: any): boolean;
export declare function copyDescriptors(source: Object, destination: Object, mod?: any): void;
export declare function setDefaultPrototypeDescriptors(prototype: Object, { defaultClassDescriptor: { writable, enumerable, configurable } }: any): void;
export declare function setDefaultStaticDescriptors(Ctor: any, { defaultClassDescriptor: { writable, enumerable, configurable } }: any, staticBlacklist?: (string | symbol)[]): void;
export {};
//# sourceMappingURL=utils.d.ts.map