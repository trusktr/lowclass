import { Class, InvalidAccessError, InvalidSuperAccessError } from '../index.js';
import Mixin from '../Mixin.js';
const test = it;
describe('Class branding and positional privacy vs lexical privacy', () => {
    test(`
        Private/protected access works across instances of a class generated
        from multiple applications of a mixin passed the same base class.
    `, () => {
        // this test works because the following mixin applications are
        // memoized, so calling `Foo.mixin()` twice without supplying differeing
        // args causes the same class constructor to be returned both times.
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
            // ^ a brand is not passed in here
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
        // This test shows private access does not work. The following two calls
        // of `Foo.mixin()` are passed different base classes, so the return
        // values are two differeing class constructors. Not passing a brand
        // means that the private access will not be shared across these classes
        // (this is called "lexical privates" according to
        // https://github.com/tc39/proposal-class-fields/issues/60.
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
            // ^ a brand is not passed in here
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        // this won't work, the implementation will treat a and b as if they
        // were made from two unrelated class definitions
        expect(() => a.getPrivateFromOther(b)).toThrowError(InvalidAccessError);
    });
    test(`
        If a brand is provided, private/protected access should work across
        instances of the same class generated from multiple applications of a
        mixin passed differing base classes.
    `, () => {
        // To make privacy work unlike in the previous example, we need to
        // define a brand for the classes generated by the mixins. The brand is
        // an object, and the Content of it doesn't matter (we could leave it
        // empty, it's just used internally as a WeakMap key). It tells the
        // Class implementation to share privacy across instances made from
        // classes that share the brand. This let's us achieve "positional
        // privacy" as described in
        // https://github.com/tc39/proposal-class-fields/issues/60
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
            // ^ passing the brand enables behavior similar to "positional privacy"
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        // although a and b were created from two different class constructors
        // due to the mixin calls, private access still works, thanks to the
        // brand which marks them as "from the same Foo class", similar to
        // privacy based on source position.
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
            // ^ passing the brand should not make Super behave like the access helpers
        });
        const BaseA = Class();
        const BaseB = Class();
        const A = Foo.mixin(BaseA);
        const B = Foo.mixin(BaseB);
        const a = new A();
        const b = new B();
        expect(() => a.callSuperOnOther(b)).toThrowError(InvalidSuperAccessError);
        // but Super should work across instances of the exact same class.
        const BaseC = Class();
        // C and D are the exact same class because the mixin returns a cached
        // class when the same base class is passed
        const C = Foo.mixin(BaseC);
        const D = Foo.mixin(BaseC);
        const c = new C();
        const d = new D();
        expect(() => c.callSuperOnOther(d)).not.toThrowError(InvalidSuperAccessError);
    });
});
//# sourceMappingURL=class-branding.test.js.map