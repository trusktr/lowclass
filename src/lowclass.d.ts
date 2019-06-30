declare module 'lowclass' {
    import Mixin from 'lowclass/Mixin'
    export { Mixin }
}

declare module 'lowclass/Mixin' {
    type MixinFunction = <TSuper>(baseClass: Constructor<TSuper>) => Constructor<TSuper>
    export default function Mixin<T extends MixinFunction>(
        mixinFn: T,
        DefaultBase?: Constructor
    ): ReturnType<T> & { mixin: T }
}

declare module 'lowclass/utils' {
    type DescriptorWithOwner = PropertyDescriptor & { owner: object }
    export function getInheritedDescriptor(obj: object, propName: string): DescriptorWithOwner
}
