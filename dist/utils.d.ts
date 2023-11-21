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
/**
 * Without type args, this is an easy shortcut for "any non-abstract constructor
 * that has any args and returns any type of object".
 *
 * With type args, define a non-abstract constructor type that returns a certain
 * instance type (optional), accepts certain args (optional, defaults to any
 * args for simplicity in cases like class-factory mixins), and has certain
 * static members (optional).
 */
export type Constructor<T = object, A extends any[] = any[], Static = {}> = (new (...a: A) => T) & Static;
/**
 * Cast any constructor type (abstract or not) into a specific Constructor type.
 * Useful for forcing type checks inside of mixins for example. This is unsafe:
 * you can incorrectly cast one constructor into an unrelated constructor type,
 * so use with care.
 */
export declare function Constructor<T = object, Static = {}>(Ctor: AnyConstructor<any>): Constructor<T> & Static;
/**
 * Without type args, this is an easy shortcut for "any abstract constructor
 * that has any args and returns any type of object".
 *
 * With type args, define an abstract constructor type that returns a certain
 * instance type (optional), accepts certain args (optional, defaults to any
 * args for simplicity in cases like class-factory mixins), and has certain
 * static members (optional).
 */
export type AbstractConstructor<T = object, A extends any[] = any[], Static = {}> = (abstract new (...a: A) => T) & Static;
/**
 * Cast any constructor type (abstract or not) into a specific
 * AbstractConstructor type. Useful for forcing type checks inside of mixins
 * for example. This is unsafe: you can incorrectly cast one constructor into an
 * unrelated constructor type, so use with care.
 */
export declare function AbstractConstructor<T = object, Static = {}>(Ctor: AnyConstructor<any>): AbstractConstructor<T> & Static;
/**
 * Combines Constructor and AbstractConstructor to support assigning any type of
 * constructor whether abstract or not.
 *
 * Without type args, this is an easy shortcut for "any constructor, abstract or not,
 * that has any args and returns any type of object".
 *
 * With type args, define a constructor type (abstract or not) that returns a
 * certain instance type (optional), accepts certain args (optional, defaults to
 * any args for simplicity in cases like class-factory mixins), and has certain
 * static members (optional).
 */
export type AnyConstructor<T = object, A extends any[] = any[], Static = {}> = Constructor<T, A, Static> | AbstractConstructor<T, A, Static>;
/**
 * Cast any constructor type (abstract or not) into a specific
 * AnyConstructor type. Useful for forcing type checks inside of mixins
 * for example. This is unsafe: you can incorrectly cast one constructor into an
 * unrelated constructor type, so use with care.
 */
export declare function AnyConstructor<T = object, Static = {}>(Ctor: AnyConstructor<any>): AnyConstructor<T> & Static;
export declare function hasPrototype(obj: any, proto: any): boolean;
export declare function copyDescriptors(source: Object, destination: Object, mod?: any): void;
export declare function setDefaultPrototypeDescriptors(prototype: Object, { defaultClassDescriptor: { writable, enumerable, configurable } }: any): void;
export declare function setDefaultStaticDescriptors(Ctor: any, { defaultClassDescriptor: { writable, enumerable, configurable } }: any, staticBlacklist?: (string | symbol)[]): void;
export {};
//# sourceMappingURL=utils.d.ts.map