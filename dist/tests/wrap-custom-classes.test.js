import Class from '../index.js';
const test = it;
describe('wrap existing classes', () => {
    test('protected and private members for custom-made ES5 classes', () => {
        const Foo = Class(({ Protected, Private }) => {
            function Foo() {
                this.foo = 'foo';
            }
            Foo.prototype = {
                constructor: Foo,
                test() {
                    expect(this.foo === 'foo').toBeTruthy();
                    expect(Private(this).bar === 'bar').toBeTruthy();
                    expect(Protected(this).baz === 'baz').toBeTruthy();
                },
                private: {
                    bar: 'bar',
                },
                protected: {
                    baz: 'baz',
                },
            };
            return Foo;
        });
        const foo = new Foo();
        foo.test();
        const Bar = Class(({ Super, Private }) => {
            const prototype = {
                __proto__: Foo.prototype,
                constructor: function () {
                    Super(this).constructor();
                },
                test() {
                    super.test();
                    expect(Private(this).who === 'you').toBeTruthy();
                },
                private: {
                    who: 'you',
                },
            };
            prototype.constructor.prototype = prototype;
            return prototype.constructor;
        });
        const bar = new Bar();
        bar.test();
    });
    test('protected and private members for custom-made native ES6+ classes', () => {
        const Lorem = Class(({ Protected, Private }) => class {
            constructor() {
                this.foo = 'foo';
            }
            test() {
                expect(this.foo === 'foo').toBeTruthy();
                expect(Private(this).bar === 'bar').toBeTruthy();
                expect(Protected(this).baz === 'baz').toBeTruthy();
            }
            get private() {
                return {
                    bar: 'bar',
                };
            }
            get protected() {
                return {
                    baz: 'baz',
                };
            }
        });
        const lorem = new Lorem();
        lorem.test();
        const Ipsum = Class(({ Private }) => {
            return class extends Lorem {
                test() {
                    super.test();
                    expect(Private(this).secret === 'he did it').toBeTruthy();
                }
                get private() {
                    return {
                        secret: 'he did it',
                    };
                }
            };
        });
        const ip = new Ipsum();
        ip.test();
    });
});
//# sourceMappingURL=wrap-custom-classes.test.js.map