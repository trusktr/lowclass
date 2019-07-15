import { Constructor } from './utils'

// export type MixinFunction<T extends Constructor> = (BaseClass: T) => T
export type MixinFunction = <T extends Constructor<any>>(BaseClass: T) => T

export function Mixin<T extends MixinFunction>(
    mixinFn: T,
    DefaultBase?: Constructor
): ReturnType<T> & { mixin: T }

// prettier-ignore
export type MixinResult<TClass extends Constructor, TBase extends Constructor> =
    Constructor<InstanceType<TClass> & InstanceType<TBase>> & TClass & TBase

export default Mixin
