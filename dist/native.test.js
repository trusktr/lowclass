import { native } from './native.js';
const test = it;
describe('native helper (newless)', () => {
    test('explain original behavior (conditions negated to pass)', () => {
        class Foo {
        }
        const _Foo = native(Foo);
        expect(!(_Foo.prototype === Foo.prototype)).toBeTruthy();
        expect(!(_Foo.prototype.constructor === Foo)).toBeTruthy();
        const f = new _Foo();
        expect(f instanceof Foo).toBeTruthy();
        expect(f instanceof _Foo).toBeTruthy();
        expect(!(f.constructor !== _Foo)).toBeTruthy();
        expect(!(f.constructor === Foo)).toBeTruthy();
    });
    test('new behavior of our version of newless', () => {
        class Foo {
        }
        const _Foo = native(Foo);
        expect(_Foo.prototype === _Foo.prototype).toBeTruthy();
        expect(_Foo.prototype.constructor === _Foo).toBeTruthy();
        const f = new _Foo();
        expect(f instanceof Foo).toBeTruthy();
        expect(f instanceof _Foo).toBeTruthy();
        expect(f.constructor === _Foo).toBeTruthy();
        expect(f.constructor !== Foo).toBeTruthy();
    });
});
//# sourceMappingURL=native.test.js.map