/** Like Object.getOwnPropertyDescriptor, but looks up the prototype chain for the descriptor. */
export declare function getInheritedDescriptor<T extends object>(obj: T, key: keyof T): DescriptorWithOwner | undefined;
export interface DescriptorWithOwner extends PropertyDescriptor {
    owner: object;
}
//# sourceMappingURL=getInheritedDescriptor.d.ts.map