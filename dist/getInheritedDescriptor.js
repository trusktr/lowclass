/** Like Object.getOwnPropertyDescriptor, but looks up the prototype chain for the descriptor. */
export function getInheritedDescriptor(obj, key) {
    let currentProto = obj;
    let descriptor;
    while (currentProto) {
        descriptor = Object.getOwnPropertyDescriptor(currentProto, key);
        if (descriptor) {
            ;
            descriptor.owner = currentProto;
            return descriptor;
        }
        currentProto = currentProto.__proto__;
    }
    return void 0;
}
//# sourceMappingURL=getInheritedDescriptor.js.map