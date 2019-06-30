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
