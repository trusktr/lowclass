type DescriptorWithOwner = PropertyDescriptor & { owner: object }

export function getInheritedDescriptor(obj: object, propName: string): DescriptorWithOwner

// TODO
// export {
//     getFunctionBody,
//     setDescriptor,
//     setDescriptors,
//     propertyIsAccessor,
//     getInheritedPropertyNames,
//     WeakTwoWayMap,
// }

export type Constructor<T = object, A extends any[] = any[], Static = {}> = (new (...a: A) => T) &
    Static

export function Constructor<T = object, Static = {}>(
    Ctor: Constructor<any>
): Constructor<T> & Static
// {
//     return (Ctor as unknown) as Constructor<T> & Static
// }
