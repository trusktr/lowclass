import { Constructor } from './types'

// export type MixinFunction = <TSuper>(BaseClass: Constructor<TSuper>) => Constructor<TSuper>
// export type MixinFunction = <TCtor extends Constructor>(BaseClass: TCtor) => TCtor
// export type MixinFunction<T = any> = (BaseClass: Constructor<T>) => Constructor<T>
// export type MixinFunction = (BaseClass: Constructor<any>) => Constructor<any>
export type MixinFunction<T extends Constructor> = (BaseClass: T) => T

export function Mixin<T extends MixinFunction>(
    mixinFn: T,
    DefaultBase?: Constructor
): ReturnType<T> & { mixin: T }

export default Mixin
