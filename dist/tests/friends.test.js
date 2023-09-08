import { Counter, Incrementor } from './Counter.js';
import { Counter2, Incrementor2 } from './Counter2.js';
const test = it;
describe('Friends', () => {
    test(`
        functionality similar to "friend" in C++ or "package protected" in Java,
        by means of intentionally leaked access helpers
    `, () => {
        const counter = new Counter();
        const incrementor = new Incrementor(counter);
        expect(counter.count).toBe(undefined);
        expect(counter.increment).toBe(undefined);
        expect(typeof counter.value).toBe('function');
        expect(incrementor.counter).toBe(undefined);
        expect(typeof incrementor.increment).toBe('function');
        expect(counter.value()).toBe(0);
        incrementor.increment();
        expect(counter.value()).toBe(1);
        incrementor.increment();
        expect(counter.value()).toBe(2);
    });
    test(`
        functionality similar to "friend" in C++ or "package protected" in Java,
        by means of intentionally shared class brands
    `, () => {
        const counter = new Counter2();
        const incrementor = new Incrementor2(counter);
        expect(counter.count).toBe(undefined);
        expect(counter.increment).toBe(undefined);
        expect(typeof counter.value).toBe('function');
        expect(incrementor.counter).toBe(undefined);
        expect(typeof incrementor.increment).toBe('function');
        expect(counter.value()).toBe(0);
        incrementor.increment();
        expect(counter.value()).toBe(1);
        incrementor.increment();
        expect(counter.value()).toBe(2);
    });
});
//# sourceMappingURL=friends.test.js.map