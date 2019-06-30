type MixinFunction = <TSuper>(baseClass: Constructor<TSuper>) => Constructor<TSuper>

export function Mixin<T extends MixinFunction>(
    mixinFn: T,
    DefaultBase?: Constructor
): ReturnType<T> & { mixin: T }

export default Mixin
