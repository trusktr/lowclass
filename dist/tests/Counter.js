// show how to do something similar to "friend" in C++ or "package protected"
// in Java, using intentionally leaked access helpers
import Class from '../index.js';
let CounterProtected;
const Counter = Class(({ Private, Protected }) => {
    // leak the Counter class Protected helper to outer scope
    CounterProtected = Protected;
    return {
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
    };
});
// note how Incrementor does not extend from Counter
const Incrementor = Class(({ Private }) => ({
    constructor(counter) {
        Private(this).counter = counter;
    },
    increment() {
        const counter = Private(this).counter;
        CounterProtected(counter).increment();
    },
}));
export { Counter, Incrementor };
//# sourceMappingURL=Counter.js.map