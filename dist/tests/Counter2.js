import Class from '../index.js';
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