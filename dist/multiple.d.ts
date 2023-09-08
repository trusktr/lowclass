import type { Constructor } from './utils.js';
declare enum ImplementationMethod {
    PROXIES_ON_INSTANCE_AND_PROTOTYPE = "PROXIES_ON_INSTANCE_AND_PROTOTYPE",
    PROXIES_ON_PROTOTYPE = "PROXIES_ON_PROTOTYPE",
    PROXY_AFTER_INSTANCE_AND_PROTOTYPE = "PROXY_AFTER_INSTANCE_AND_PROTOTYPE"
}
declare type MultipleOptions = {
    method: ImplementationMethod;
};
export declare function makeMultipleHelper(options?: MultipleOptions): <T extends (new (...a: any[]) => object)[]>(...classes: T) => CombinedClasses<T>;
export declare const multiple: <T extends (new (...a: any[]) => object)[]>(...classes: T) => CombinedClasses<T>;
declare type Shift<T extends any[]> = ((...args: T) => any) extends (_: any, ...args: infer R) => any ? R : never;
declare type MixedArray<T extends Constructor<any>[]> = _MixedArray<T, {}>;
declare type _MixedArray<T extends Constructor<any>[], U> = {
    0: new () => U;
    1: _MixedArray<Shift<T>, {
        [K in keyof InstanceType<T[0]> | keyof U]: K extends keyof U ? U[K] : InstanceType<T[0]>[K];
    }>;
}[T['length'] extends 0 ? 0 : 1];
declare type CombinedClasses<T> = T extends [] | [undefined] ? typeof Object : T extends Constructor[] ? MixedArray<T> : typeof Object;
export {};
//# sourceMappingURL=multiple.d.ts.map