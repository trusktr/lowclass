
// various forms of writing classes ("syntaxes")

const Class = require('../index')

test('simple object literal', () => {
    const Foo = Class({
        constructor() {
            this.bar = 'bar'
        },
        foo() {
            expect( this.bar === 'bar' ).toBeTruthy()
        },
    })

    const f = new Foo
    expect( f instanceof Foo ).toBeTruthy()
    f.foo()
})

test('simple definer function', () => {
    const Foo = Class(({Super}) => ({
        constructor() {
            this.bar = 'bar'
        },
        foo() {
            expect( Super(this).hasOwnProperty('bar') ).toBe( true )
            expect( this.bar === 'bar' ).toBeTruthy()
        },
    }))

    const f = new Foo
    expect( f instanceof Foo ).toBeTruthy()
    f.foo()
})

test('simple native class', () => {
    const Foo = Class(() => class {
        constructor() {
            this.bar = 'bar'
        }
        foo() {
            expect( this.bar === 'bar' ).toBeTruthy()
        }
    })

    const f = new Foo
    expect( f instanceof Foo ).toBeTruthy()
    f.foo()
})

test('simple ES5 class', () => {
    const Foo = Class(() => {
        function Foo() {
            this.bar = 'bar'
        }

        Foo.prototype = {
            constructor: Foo,
            foo() {
                expect( this.bar === 'bar' ).toBeTruthy()
            }
        }

        return Foo
    })

    const f = new Foo
    expect( f instanceof Foo ).toBeTruthy()
    f.foo()
})

test('object literal with access helpers', () => {
    const Foo = Class({
        public: (Protected, Private) => ({
            constructor() {
                this.bar = 'bar'
            },
            foo() {
                expect( this.bar === 'bar' ).toBeTruthy()
                expect( Protected(this).foo() === 'barbar3' ).toBeTruthy()
                expect( Private(this).foo() === 'barbar2' ).toBeTruthy()
                return 'it works'
            },
        }),
        protected: (Public, Private) => ({
            bar: 'bar2',
            foo() {
                return Public(this).bar + Private(this).bar
            }
        }),
        private: (Public, Protected) => ({
            bar: 'bar3',
            foo() {
                return Public(this).bar + Protected(this).bar
            }
        }),
    })

    const f = new Foo
    expect( f instanceof Foo ).toBeTruthy()
    expect( f.foo() === 'it works' ).toBeTruthy()

    const Bar = Foo.subclass({
        public: Protected => ({
            test() {
                return Protected(this).test()
            }
        }),
        protected: ({Super, Public}) => ({
            test() {
                return Super(Public(this)).foo()
            }
        })
    })

    const b = new Bar
    expect( b instanceof Bar ).toBeTruthy()
    expect( b.foo() === 'it works' ).toBeTruthy()
})
