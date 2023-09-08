import Mixin, { HasInstance } from './Mixin.js';
import instanceOf from './instanceOf.js';
import { Constructor } from './utils.js';
describe('Mixin', () => {
    it('Mixin returns a Function', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin);
        class Bar {
        }
        const Baz = Foo.mixin(Bar);
        const Lorem = Foo.mixin(Bar);
        expect(typeof Foo).toBe('function');
        expect(typeof Foo.mixin).toBe('function');
        expect(typeof Baz).toBe('function');
        expect(typeof Lorem).toBe('function');
    });
    it('Mixin applications are cached', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin);
        class Bar {
        }
        const Baz = Foo.mixin(Bar);
        const Lorem = Foo.mixin(Bar);
        expect(Baz).toBe(Lorem);
    });
    it('instanceof works with multiple classes generated from the same Mixin', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin);
        class Bar {
        }
        const Baz = Foo.mixin(Bar);
        const Lorem = Foo.mixin(Bar);
        const baz = new Baz();
        expect(baz instanceof Foo).toBe(true);
        expect(baz instanceof Bar).toBe(true);
        expect(baz instanceof Baz).toBe(true);
        expect(baz instanceof Lorem).toBe(true);
        expect(instanceOf(baz, Foo)).toBe(true);
        expect(instanceOf(baz, Bar)).toBe(true);
        expect(instanceOf(baz, Baz)).toBe(true);
        expect(instanceOf(baz, Lorem)).toBe(true);
    });
    it('HasInstance delegates to super Symbol.hasInstance method, so regular instanceof works', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin);
        class Bar {
        }
        const Baz = Foo.mixin(Bar);
        expect({} instanceof Baz).toBe(false);
        class Thing extends Baz {
        }
        expect(new Thing() instanceof Thing).toBe(true);
    });
    it('When Symbol is supported, instanceof works', () => {
        function IpsumMixin(Base) {
            class Ipsum extends Constructor(Base) {
            }
            return Ipsum;
        }
        const Ipsum = Mixin(IpsumMixin);
        class Blah {
        }
        const One = Ipsum.mixin(Blah);
        const one = new One();
        expect(one instanceof One).toBe(true);
        expect(one instanceof Ipsum).toBe(true);
    });
    it('When Symbol is not supported, instanceof does not work', () => {
        function test() {
            function IpsumMixin(Base) {
                class Ipsum extends Constructor(Base) {
                }
                return Ipsum;
            }
            const Ipsum = Mixin(IpsumMixin);
            class Blah {
            }
            const One = Ipsum.mixin(Blah);
            const one = new One();
            expect(one instanceof One).toBe(true);
            expect(one instanceof Ipsum).toBe(false);
        }
        const originalSymbol = Symbol;
        Symbol = (() => Math.random());
        test();
        Symbol = void 0;
        test();
        Symbol = originalSymbol;
    });
    it('if a class already has its own Symbol.hasInstance method, we do not override it', () => {
        function fn() { }
        let FooMixin = function FooMixin(Base) {
            class Foo extends Constructor(Base || Object) {
            }
            Object.defineProperty(Foo, Symbol.hasInstance, { value: fn });
            return Foo;
        };
        FooMixin = HasInstance(FooMixin);
        const Foo = FooMixin(class {
        });
        expect(Foo[Symbol.hasInstance]).toBe(fn);
        let BarMixin = function BarMixin(Base) {
            class Bar extends Constructor(Base || Object) {
            }
            return Bar;
        };
        BarMixin = HasInstance(BarMixin);
        const Bar = BarMixin(class {
        });
        expect(Bar[Symbol.hasInstance]).not.toBe(fn);
    });
    it('configuring a default base class', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin, Map);
        const Bar = class Bar extends Foo {
        };
        const bar = new Bar();
        const Baz = class Baz extends Foo.mixin(WeakMap) {
        };
        const baz = new Baz();
        expect(bar instanceof Map).toBe(true);
        expect(baz instanceof Map).toBe(false);
        expect(baz instanceof WeakMap).toBe(true);
    });
    it('check there are no duplicate applications of a mixin in a class hierarchy', () => {
        function FooMixin(Base) {
            class Foo extends Constructor(Base) {
            }
            return Foo;
        }
        const Foo = Mixin(FooMixin, Map);
        class Bar extends Foo {
        }
        expect(Foo.mixin(Bar)).toBe(Bar);
    });
});
//# sourceMappingURL=Mixin.test.js.map