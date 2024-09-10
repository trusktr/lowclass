import type { Constructor } from './Constructor.js';
export type MixinFunction = <T extends Constructor<any>>(BaseClass: T) => T;
export type MixinFunctionWithDefault = <T extends Constructor<any>>(BaseClass?: T) => T;
export type MixinResult<TClass extends Constructor, TBase extends Constructor> = Constructor<InstanceType<TClass> & InstanceType<TBase>> & TClass & TBase;
export declare function Mixin<T extends MixinFunction>(mixinFn: T, DefaultBase?: Constructor): ReturnType<T> & {
    mixin: T;
};
export default Mixin;
export { WithDefault, Cached, HasInstance, ApplyDefault, Dedupe };
declare function WithDefault<T extends MixinFunction>(classFactory: T, Default: Constructor): MixinFunction;
declare function Cached<T extends MixinFunction>(classFactory: T): (Base: Constructor) => any;
declare function HasInstance<T extends MixinFunction>(classFactory: T): MixinFunction;
declare function ApplyDefault<T extends MixinFunction>(classFactory: T): T;
declare function Dedupe<T extends MixinFunction>(classFactory: T): MixinFunction;
//# sourceMappingURL=Mixin.d.ts.map