// show how to do something similar to "friend" in C++ or "package protected"
// in Java, using intentionally shared class brands
import Class from '../index.js';
// an empty object used as a brand key by the Class() helper
//
// NOTE Too bad Symbols aren't supported by WeakMaps, otherwise we could use a
// Symbol here, which would be cleaner.
let FriendKey = {};
const Counter2 = Class('Counter2', ({ Private }) => ({
    value() {
        return Private(this).count;
    },
    private: {
        count: 0,
    },
    protected: {
        increment() {
            Private(this).count++;
        },
    },
}), FriendKey);
// note how Incrementor2 does not extend from Counter2
const Incrementor2 = Class('Incrementor2', ({ Private, Protected }) => ({
    constructor(counter) {
        Private(this).counter = counter;
    },
    increment() {
        const counter = Private(this).counter;
        Protected(counter).increment();
    },
}), FriendKey);
export { Counter2, Incrementor2 };
//# sourceMappingURL=Counter2.js.map