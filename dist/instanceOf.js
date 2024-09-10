/**
 * A ponyfill for `instanceof` with support for Symbol.hasInstance for older
 * environments. Use in place of native `instanceof`.
 */
export default function instanceOf(instance, Constructor) {
    if (typeof Constructor == 'function' && Constructor[Symbol.hasInstance])
        return Constructor[Symbol.hasInstance](instance);
    else
        return instance instanceof Constructor;
}
//# sourceMappingURL=instanceOf.js.map