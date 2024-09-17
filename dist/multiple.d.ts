import type { Constructor } from './Constructor.js';
declare enum ImplementationMethod {
    PROXIES_ON_INSTANCE_AND_PROTOTYPE = "PROXIES_ON_INSTANCE_AND_PROTOTYPE",
    PROXIES_ON_PROTOTYPE = "PROXIES_ON_PROTOTYPE",
    PROXY_AFTER_INSTANCE_AND_PROTOTYPE = "PROXY_AFTER_INSTANCE_AND_PROTOTYPE"
}
type MultipleOptions = {
    method: ImplementationMethod;
};
export declare function makeMultipleHelper(options?: MultipleOptions): <T extends Constructor[]>(...classes: T) => CombinedClasses<T>;
/**
 * Mixes the given classes into a single class. This is useful for multiple
 * inheritance.
 *
 * @example
 * class Foo {}
 * class Bar {}
 * class Baz {}
 * class MyClass extends multiple(Foo, Bar, Baz) {}
 */
export declare const multiple: <T extends Constructor[]>(...classes: T) => CombinedClasses<T>;
type Shift<T extends any[]> = ((...args: T) => any) extends (_: any, ...args: infer R) => any ? R : never;
type MixedArray<T extends Constructor<any>[]> = _MixedArray<T, {}>;
type _MixedArray<T extends Constructor<any>[], U> = {
    0: new () => U;
    1: _MixedArray<Shift<T>, {
        [K in keyof InstanceType<T[0]> | keyof U]: K extends keyof U ? U[K] : InstanceType<T[0]>[K];
    }>;
}[T['length'] extends 0 ? 0 : 1];
type CombinedClasses<T> = T extends [] | [undefined] ? typeof Object : T extends Constructor[] ? MixedArray<T> : typeof Object;
export {};
//# sourceMappingURL=multiple.d.ts.map