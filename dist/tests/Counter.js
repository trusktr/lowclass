import Class from '../index.js';
let CounterProtected;
const Counter = Class(({ Private, Protected }) => {
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