import { Class, InvalidAccessError, InvalidSuperAccessError } from '../index.js';
import Mixin from '../Mixin.js';
const test = it;
describe('Class branding and positional privacy vs lexical privacy', () => {
    test(`
        Private/protected access works across instances of a class generated
        from multiple applications of a mixin passed the same base class.
    `, () => {
        let count = 0;
        const Foo = Mixin((Base = Class()) => {
            return Class('Foo').extends(Base, ({ Super, Private }) => ({
                constructor() {
                    Super(this).constructor();
                    Private(this).foo = ++count;
                },
                getPrivateFromOther(other) {
                    return Private(other).foo;
                },
            }));
        });
        const A = Foo.mixin();
        const B = Foo.mixin();
        const a = new A();
        const b = new B();
        expect(a.getPrivateFromOther(b)).toBe(2);
    });
    test(`
        If no brand is provided, private/protected access does NOT work across
        instances of a class generated from multiple applications of a mixin
        passed differing base classes.
    `, () => {
        let count = 0;
        const Foo = Mixin((Base = Class()) => {
            return Class('Foo').extends(Base, ({ Super, Private }) => ({
                constructor() {
                    Super(this).constructor();
                    Private(this).foo = ++count;
                },
                getPrivateFromOther(other) {
                    return Private(other).foo;
                },
            }));
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        expect(() => a.getPrivateFromOther(b)).toThrowError(InvalidAccessError);
    });
    test(`
        If a brand is provided, private/protected access should work across
        instances of the same class generated from multiple applications of a
        mixin passed differing base classes.
    `, () => {
        const FooBrand = { brand: 'FooBrand' };
        let count = 0;
        let proto = 0;
        const Foo = Mixin((Base = Class()) => {
            return Class('Foo').extends(Base, ({ Super, Private }) => ({
                proto: ++proto,
                constructor() {
                    Super(this).constructor();
                    Private(this).foo = ++count;
                },
                getPrivateFromOther(other) {
                    return Private(other).foo;
                },
            }), FooBrand);
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        expect(a.getPrivateFromOther(b)).toBe(2);
    });
    test(`the Super helper should not work across instances of a branded class`, () => {
        const FooBrand = { brand: 'FooBrand' };
        const Foo = Mixin(Base => {
            return Class('Foo').extends(Base, ({ Super, Private }) => ({
                constructor() {
                    Super(this).constructor();
                },
                callSuperOnOther(other) {
                    Super(other);
                },
            }), FooBrand);
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        expect(() => a.callSuperOnOther(b)).toThrowError(InvalidSuperAccessError);
        const BaseC = Class();
        const C = Foo.mixin(BaseC);
        const D = Foo.mixin(BaseC);
        const c = new C();
        const d = new D();
        expect(() => c.callSuperOnOther(d)).not.toThrowError(InvalidSuperAccessError);
    });
});
//# sourceMappingURL=class-branding.test.js.map