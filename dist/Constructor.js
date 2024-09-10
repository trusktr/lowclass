/**
 * Cast any constructor type (abstract or not) into a specific Constructor type.
 * Useful for forcing type checks inside of mixins for example. This is unsafe:
 * you can incorrectly cast one constructor into an unrelated constructor type,
 * so use with care.
 */
export function Constructor(Ctor) {
    return Ctor;
}
/**
 * Cast any constructor type (abstract or not) into a specific
 * AbstractConstructor type. Useful for forcing type checks inside of mixins
 * for example. This is unsafe: you can incorrectly cast one constructor into an
 * unrelated constructor type, so use with care.
 */
export function AbstractConstructor(Ctor) {
    return Ctor;
}
/**
 * Cast any constructor type (abstract or not) into a specific
 * AnyConstructor type. Useful for forcing type checks inside of mixins
 * for example. This is unsafe: you can incorrectly cast one constructor into an
 * unrelated constructor type, so use with care.
 */
export function AnyConstructor(Ctor) {
    return Ctor;
}
//# sourceMappingURL=Constructor.js.map