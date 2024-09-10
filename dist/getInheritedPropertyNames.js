/** Like Object.getOwnPropertyNames, but gets property names including from ancestor prototypes. */
export function getInheritedPropertyNames(obj) {
    let currentProto = obj;
    let keys = [];
    while (currentProto) {
        keys = keys.concat(Object.getOwnPropertyNames(currentProto));
        currentProto = currentProto.__proto__;
    }
    // remove duplicates
    keys = Array.from(new Set(keys));
    return keys;
}
//# sourceMappingURL=getInheritedPropertyNames.js.map