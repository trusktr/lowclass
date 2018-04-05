const { Class, createClassHelper, InvalidAccessError, InvalidSuperAccessError } = require('./src/index')
const { native } = require('./src/newless')

const assert = console.assert.bind( console )

/////////////////////////////////////////////////////////////////////
// example of extending HTMLElement for use with customElements.define
if ( typeof customElements !== 'undefined' && customElements.define ) {
}

/////////////////////////////////////////////////////////////////////
// TODO test invalid Super access, InvalidSuperAccessError

/////////////////////////////////////////////////////////////////////
// Example of etending Array
{
    const MyArray = Class().extends( native(Array), (Public, Protected) => ({
        constructor(...args) {
            const self = super.constructor(...args)
            self.__proto__ = MyArray.prototype
            return self
        },
        add(...args) {
            return Protected(this).add(...args)
        },
        protected: {
            add(...args) {
                return Public(this).push(...args)
            },
        },
    }))

    MyArray[Symbol.species] = MyArray

    const a = new MyArray
    assert( a instanceof Array )
    assert( a instanceof MyArray )

    assert( a.add(1,2,3) === 3 )
    assert( a.length === 3 )
    assert( a.concat(4,5,6).length === 6 )
    assert( a.concat(4,5,6) instanceof MyArray )
    assert( Array.isArray(a) )
}

// ##################################################
// protected and private members for custom-made classes (es5 or native es6)
{
    const Foo = Class(({Protected, Private}) => {

        // make and return our own es5-style base class, with Protected and
        // Private helpers in scope.

        function Foo() {
            this.foo = 'foo'
        }

        Foo.prototype = {
            constructor: Foo,
            test() {
                assert( this.foo === 'foo' )
                assert( Private(this).bar === 'bar' )
                assert( Protected(this).baz === 'baz' )
            },

            // define access just like with regular class definitions
            private: {
                bar: 'bar'
            },
            protected: {
                baz: 'baz'
            },
        }

        return Foo
    })

    const foo = new Foo
    foo.test()

    const Bar = Class(({Super, Private}) => {

        // make and return our own es5-style subclass

        const prototype = {
            __proto__: Foo.prototype,

            constructor: function() {
                Super(this).constructor()
            },

            test() {
                super.test()
                assert( Private(this).who === 'you' )
            },

            private: {
                who: 'you'
            },
        }

        prototype.constructor.prototype = prototype

        return prototype.constructor
    })

    const bar = new Bar
    bar.test()

    // wrap our own es6 native-style base class with access helpers in scope.
    const Lorem = Class(({Protected, Private}) => class {
        constructor() {
            this.foo = 'foo'
        }

        test() {
            assert( this.foo === 'foo' )
            assert( Private(this).bar === 'bar' )
            assert( Protected(this).baz === 'baz' )
        }

        get private() { return {
            bar: 'bar'
        }}

        get protected() { return {
            baz: 'baz'
        }}
    })

    const lorem = new Lorem
    lorem.test()

    // wrap our own es6 native-style subclass with the access helpers in scope
    const Ipsum = Class(({Private}) => {
        return class extends Lorem {
            test() {
                super.test()
                assert( Private(this).secret === 'he did it' )
            }

            get private() { return {
                secret: 'he did it'
            }}
        }
    })

    const ip = new Ipsum
    ip.test()
}

// ##################################################
// anonymous empty base classes
{
    const Constructor = Class()
    const instance = new Constructor
    assert( instance instanceof Constructor )
    assert( Constructor.name === '' )
    assert( Constructor.prototype.__proto__ === Object.prototype )
}

// ##################################################
// named empty base class
{
    const Foo = Class("Foo")
    const foo = new Foo
    assert( foo instanceof Foo )
    assert( Foo.name === "Foo" )
    assert( Foo.prototype.__proto__ === Object.prototype )
}

// ##################################################
// anonymous non-empty base class
{
    const Dog = Class(() => ({
        method() {}
    }))

    assert( Dog.name === "" )
    assert( Dog.prototype.__proto__ === Object.prototype )

    const dog = new Dog
    assert( dog instanceof Dog )
    assert( typeof dog.method === 'function' )
}

// ##################################################
// named non-empty base class
{
    const Dog = Class('Dog', () => ({
        method() {}
    }))

    assert( Dog.name === "Dog" )
    assert( Dog.prototype.__proto__ === Object.prototype )

    const dog = new Dog
    assert( dog instanceof Dog )
    assert( typeof dog.method === 'function' )
}

// ##################################################
// anonymous empty subclass
{
    const LivingThing = Class()
    const Alien = Class().extends(LivingThing)
    assert( Alien.name === "" )
    assert( Alien.prototype.__proto__ === LivingThing.prototype )

    const a = new Alien
    assert( a instanceof Alien )
}

// ##################################################
// named empty subclass
{
    const LivingThing = Class("LivingThing")
    const Alien = Class("Alien").extends(LivingThing)
    assert( Alien.name === "Alien" )
    assert( Alien.prototype.__proto__ === LivingThing.prototype )

    const a = new Alien
    assert( a instanceof Alien )
}

// ##################################################
// anonymous non-empty subclass
{
    const LivingThing = Class(() => ({
        method1() {}
    }))
    const Alien = Class().extends(LivingThing, () => ({
        method2() {}
    }))
    assert( Alien.name === "" )
    assert( Alien.prototype.__proto__ === LivingThing.prototype )

    const a = new Alien
    assert( a instanceof Alien )
    assert( a.method1 )
    assert( a.method2 )
}

// ##################################################
// named non-empty subclass
{
    const LivingThing = Class("LivingThing", () => ({
        method1() {}
    }))
    const Alien = Class("Alien").extends(LivingThing, () => ({
        method2() {}
    }))
    assert( Alien.name === "Alien" )
    assert( Alien.prototype.__proto__ === LivingThing.prototype )

    const a = new Alien
    assert( a instanceof Alien )
    assert( typeof a.method1 === 'function' )
    assert( typeof a.method2 === 'function' )
}

// ##################################################
// anonymous subclass with extends at the end
{
    const SeaCreature = Class(() => ({
        method1() {}
    }))

    const Shark = Class(() => ({
        method2() {}
    })).extends(SeaCreature)

    assert( Shark.name === "" )
    assert( Shark.prototype.__proto__ === SeaCreature.prototype )

    const shark = new Shark
    assert( shark instanceof Shark )
    assert( typeof shark.method1 === 'function' )
    assert( typeof shark.method2 === 'function' )
}

// ##################################################
// named subclass with extends at the end
{
    const SeaCreature = Class(() => ({
        method1() {}
    }))

    const Shark = Class('Shark', () => ({
        method2() {}
    })).extends(SeaCreature)

    assert( Shark.name === "Shark" )
    assert( Shark.prototype.__proto__ === SeaCreature.prototype )

    const shark = new Shark
    assert( shark instanceof Shark )
    assert( typeof shark.method1 === 'function' )
    assert( typeof shark.method2 === 'function' )
}

// ##################################################
// only public members can be read/written from outside code
{

    const Dog = Class('Dog', ({Protected, Private}) => ({
        setFoo() {
            this.foo = 'woo hoo'
        },
        checkFoo() {
            console.assert( this.foo === 'weee' )
        },
        setBar() {
            Protected(this).bar = 'yippee'
        },
        checkBar() {
            console.assert( Protected(this).bar === 'yippee' )
        },
        setBaz() {
            Private(this).baz = 'oh yeah'
        },
        checkBaz() {
            console.assert( Private(this).baz === 'oh yeah' )
        },
    }))

    const dog = new Dog
    dog.setFoo()
    dog.foo = 'weee'
    console.assert( dog.foo === 'weee' )
    dog.checkFoo()

    dog.bar = 'yoohoo'
    dog.setBar()
    console.assert( dog.bar === 'yoohoo' )
    dog.checkBar()

    dog.baz = 'hee hee'
    dog.setBaz()
    console.assert( dog.baz === 'hee hee' )
    dog.checkBaz()
}

// ##################################################
// we should not be able to access protected members from an unrelated class
try {
    const Dog = Class('Dog', ({Protected}) => {
        Protected.prototype.sound = "Woof!"
    })

    const UnrelatedClass = Class(function UnrelatedClass(Public, Protected) {
        Public.prototype.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', Protected(dog).sound)
        }
    })

    let u = new UnrelatedClass
    u.testInvalidAccess()

    throw 'fail'
}
catch (e) {
    if ( !( e instanceof InvalidAccessError ) )
        throw e
}

// ##################################################
// we should not be able to access private members from an unrelated class
try {
    const Dog = Class('Dog', ({Private}) => {
        Private.prototype.breed = "labrador"
    })

    const UnrelatedClass = Class(function UnrelatedClass({Public, Private}) {
        Public.prototype.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', Private(dog).breed)
        }
    })

    const u = new UnrelatedClass
    u.testInvalidAccess()

    throw 'fail'
}
catch (e) {
    if ( !( e instanceof InvalidAccessError ) )
        throw e
}

// ##################################################
// we can access a child class protected member from a super class
{
    const Animal = Class('Animal', ({Protected}) => ({
        getDogSound: function talk() {
            const dog = new Dog
            return Protected(dog).sound
        },
    }))

    const Dog = Animal.subclass('Dog', ({Protected}) => {
        Protected.prototype.sound = "Woof!"
    })

    const animal = new Animal
    const dogSound = animal.getDogSound()

    console.assert( dogSound === 'Woof!' )
}

// ##################################################
// we can access a super class protected member from a child class
{
    const Animal = Class('Animal', ({Protected}) => {
        Protected.prototype.alive = true
    })

    const Dog = Animal.subclass('Dog', ({Protected}) => ({
        isAlive() {
            return Protected(this).alive
        }
    }))

    const dog = new Dog
    console.assert( dog.isAlive() === true )
}

// ##################################################
// we can not access a child class' private member from a parent class
{

    let AnimalPrivate = null

    const Animal = Class('Animal', ({Private}) => {

        AnimalPrivate = Private

        return {
            public: {
                foo: function talk() {
                    const dog = new Dog

                    // like in C++, accessing the private variable of a child class does not work.
                    console.assert( Private(dog).sound === undefined )

                    // like in C++, we can only access the private members associated with the class that we are currently in:
                    console.assert( Private(dog).bar === 'BAR' )

                    Private(dog).sound = 'Awoooo!'
                    dog.verifySound()
                    dog.changeSound()
                    console.assert( Private(dog).sound === 'Awoooo!' )

                    Private(dog).bar = 'of soap'
                    dog.checkBar() // dog's is still "BAR"

                    Private(this).bar = 'of soap'
                    dog.checkBar() // dog's is still "BAR"

                    dog.exposePrivate()
                    assert( Private(dog) !== dogPrivate )
                    assert( Private(this) !== dogPrivate )
                    assert( Private(this) !== Private(dog) )
                },
            },

            private: {
                bar: 'BAR',
            },
        }
    })

    let dogPrivate = null

    const Dog = Animal.subclass(function Dog({Public, Private}) {
        Private.prototype.sound = "Woof!"
        Public.prototype.verifySound = function() {
            assert( Private(this).sound === 'Woof!' )
        }
        Public.prototype.changeSound = function() {
            Private(this).sound = "grrr!"
        }
        Public.prototype.checkBar = function() {

            // the private instance for the Dog class is not the same instance a for the Animal class
            assert( Private(this) !== AnimalPrivate(this) )

            // private bar was inherited, but the instance is still private
            assert( Private(this).bar === 'BAR' )

            // and therefore this value is different, because it's a different instance
            assert( AnimalPrivate(this).bar === 'of soap' )
        }
        Public.prototype.exposePrivate = function() {
            dogPrivate = Private(this)
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()
}

// ##################################################
// we can not access a parent class' private member from a child class
{

    const Animal = Class('Animal', ({Private}) => ({
        private: {
            bar: 'BAR',
        },
        changeBar() {
            Private(this).bar = 'hokey pokey'
        },
    }))

    const Dog = Animal.subclass(function Dog({Public, Private}) {
        Private.prototype.sound = "Woof!"
        Public.prototype.foo = function() {

            // we should not be able to access Animal's private bar property
            this.changeBar() // changed Animal's private bar property

            // 'BAR' is inherited, and is unique to Dog code, so the value is
            // not 'hokey pokey'
            assert( Private(this).bar === 'BAR' )

            assert( this.bar === undefined )
        }
    })

    const dog = new Dog
    dog.foo()
}

// ##################################################
// further example, private members are isolated to their classes
{

    const Animal = Class('Animal', ({Private}) => ({
        public: {
            test: function() {
                const dog = new Dog
                dog.bar = 'bar'
                dog.setBar()
                console.assert( Private(this).bar === 'oh yeah' )
                Private(this).bar = 'mmm hmmm'
                dog.checkBar()
                console.assert( Private(this).bar === 'mmm hmmm' )
            },
        },

        private: {
            bar: 'oh yeah',
        },
    }))

    const Dog = Animal.subclass('Dog', ({Private}) => ({
        setBar: function() {
            Private(this).bar = 'yippee'
        },
        checkBar: function() {
            console.assert( Private(this).bar === 'yippee' )
            Private(this).bar = 'woohoo'
        },
    }))

    const animal = new Animal
    animal.foo = 'foo'
    animal.test()
}

// ##################################################
// private members can be accessed only from the class where they are defined
{

    const Dog = Class(function Dog({Public, Private}) {
        Private.prototype.sound = "Woof!"
        Public.prototype.talk = function() {
            console.assert( Private(this).sound === "Woof!" )
        }
    })

    const dog = new Dog()

    // set public `sound` property
    dog.sound = 'awooo!'
    console.assert( dog.sound === 'awooo!' )

    dog.talk()

}

const publicAccesses = []
const protectedAccesses = []
const privateAccesses = []

const SomeClass = Class('SomeClass', (Public, Protected, Private) => {

    return {
        foo: 'foo',

        publicMethod: function() {
            assert( this === Public(this) )
            assert( this.foo === Public(this).foo )

            assert( this.foo === 'foo' )
            assert( Public(this).foo === 'foo' )
            assert( Protected(this).bar === 'bar' )
            assert( Private(this).baz === 'baz' )

            assert( Public(this) !== Protected(this) )
            assert( Public(this) !== Private(this) )
            assert( Protected(this) !== Private(this) )

            publicAccesses.push( Public(this) )
            protectedAccesses.push( Protected(this) )
            privateAccesses.push( Private(this) )

            Protected(this).protectedMethod()
            Private(this).privateMethod()
        },

        protected: {
            bar: 'bar',

            protectedMethod: function() {
                assert( this === Protected(this) )
                assert( this.bar === Protected(this).bar )

                assert( this.bar === 'bar' )
                assert( Public(this).foo === 'foo' )
                assert( Protected(this).bar === 'bar' )
                assert( Private(this).baz === 'baz' )

                assert( Protected(this) !== Public(this) )
                assert( Protected(this) !== Private(this) )
                assert( Public(this) !== Private(this) )

                publicAccesses.push( Public(this) )
                protectedAccesses.push( Protected(this) )
                privateAccesses.push( Private(this) )
            },
        },

        private: {
            baz: 'baz',

            privateMethod: function() {
                assert( this === Private(this) )
                assert( this.baz === Private(this).baz )

                assert( this.baz === 'baz' )
                assert( Public(this).foo === 'foo' )
                assert( Protected(this).bar === 'bar' )
                assert( Private(this).baz === 'baz' )

                assert( Private(this) !== Public(this) )
                assert( Private(this) !== Protected(this) )
                assert( Public(this) !== Protected(this) )

                publicAccesses.push( Public(this) )
                protectedAccesses.push( Protected(this) )
                privateAccesses.push( Private(this) )
            },
        },
    }
})

// ##################################################
// check that various ways to access public/protected/private members work inside a single base class
{

    const o = new SomeClass
    o.publicMethod()

    assert( o.protectedMethod === undefined )
    assert( o.privateMethod === undefined )

    assert( publicAccesses.length === 3 )
    assert( protectedAccesses.length === 3 )
    assert( privateAccesses.length === 3 )

    assert( publicAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( protectedAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( privateAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )

    publicAccesses.length = 0
    protectedAccesses.length = 0
    privateAccesses.length = 0
}

// ##################################################
// check that various ways to access public/protected/private members work inside a subclass
{

    const SubClass = SomeClass.subclass(({Super}) => ({

        publicMethod() {
            Super(this).publicMethod()
        },

        protected: {

            protectedMethod() {
                Super(this).protectedMethod()
            },

        },

        // TODO make private code inheritable? It might be useful, and does not
        // break privacy.
        //private: {

            //privateMethod() {
                //super.privateMethod()
            //},

        //},
    }))

    const o = new SubClass
    o.publicMethod()

    assert( publicAccesses.length === 3 )
    assert( protectedAccesses.length === 3 )
    assert( privateAccesses.length === 3 )

    assert( publicAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( protectedAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( privateAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )

    publicAccesses.length = 0
    protectedAccesses.length = 0
    privateAccesses.length = 0
}

// ##################################################
// make sure super spaghetti soup works
{
    const SomeClass = Class(({Protected, Private}) => ({

        // default access is public, like C++ structs
        publicMethod() {
            Protected(this).protectedMethod()
        },

        checkPrivateProp() {
            console.assert( Private(this).lorem === 'foo' )
        },

        protected: {
            protectedMethod() {
                Private(this).lorem = 'foo'
            },
        },

        private: {
            lorem: 'blah',
        },
    }))

    const SubClass = Class().extends(SomeClass, ({Private, Super}) => ({

        publicMethod() {
            Super(this).publicMethod()
            Private(this).lorem = 'baaaaz'
            this.checkPrivateProp()
        },

        checkPrivateProp() {
            Super(this).checkPrivateProp()
            console.assert( Private(this).lorem === 'baaaaz' )
        },

        protected: {

            protectedMethod() {
                Super(this).protectedMethod()
            },

        },

        private: {
            lorem: 'bar',
        },
    }))

    const GrandChildClass = SubClass.subclass((Public, Protected, Private, Super) => ({

        test() {
            Private(this).begin()
        },

        reallyBegin() {
            Protected(this).reallyReallyBegin()
        },

        protected: {
            reallyReallyBegin() {
                Super(Public(this)).publicMethod()
            },
        },

        private: {
            begin() {
                Public(this).reallyBegin()
            },
        },
    }))

    const o = new GrandChildClass
    o.test()

    console.assert( typeof o.test === 'function' )
    console.assert( o.reallyReallyBegin === undefined )
    console.assert( o.begin === undefined )
}

// ##################################################
// there's no recursive example (I've seen this example floating around, f.e.
// at https://stackoverflow.com/a/11199220/454780 and other places)
{
    const A = Class({
        foo: function (n) { return n }
    })

    const B = A.subclass(({Super}) => ({
        foo: function (n) {
            if (n > 100) return -1;
            return Super(this).foo(n+1);
        }
    }))

    const C = B.subclass(({Super}) => ({
        foo: function (n) {
            return Super(this).foo(n+2);
        }
    }))

    var c = new C();
    assert( c.foo(0) === 3 )
}

// ##################################################
// Slightly modifying the previous example, show that builtin `super` also
// works (for ES6+ environments)
{
    const A = Class({
        foo: function (n) { return n }
    })

    const B = A.subclass({
        foo(n) {
            if (n > 100) return -1;
            return super.foo(n+1);
        }
    })

    const C = B.subclass({
        foo(n) {
            return super.foo(n+2);
        }
    })

    var c = new C();
    assert( c.foo(0) === 3 )
}

// ##################################################
// leaking private of another class, showing that different private scope is
// accessed. We might call this pattern "module private".
{
    let fooPrivate

    const Foo = Class(({Private}) => {
        fooPrivate = Private

        Private.prototype.foo = "foo"
    })

    const Bar = Foo.subclass(({Private}) => ({
        test() {
            assert( fooPrivate(this).foo === 'foo' ) // "foo"
            assert( Private(this).foo === 'bar' ) // "bar"
        },
        private: {
            foo: "bar"
        }
    }))

    const bar = new Bar
    bar.test()
}

// ##################################################
// using a simple object literal instead of a definer function, useful for
// simple classes with public functionality, similar to regular `class {}`
{
    const Foo = Class({
        constructor() {
            this.bar = 'bar'
        },
        foo() {
            assert( this.bar === 'bar' )
        },
    })

    const f = new Foo
    assert( f instanceof Foo )
    f.foo()
}

// ##################################################
// using an object literal instead of a definer function, with
// public/protected/private helpers passed to the various access definitions
{
    const Foo = Class({
        public: (Protected, Private) => ({
            constructor() {
                this.bar = 'bar'
            },
            foo() {
                assert( this.bar === 'bar' )
                assert( Protected(this).foo() === 'barbar3' )
                assert( Private(this).foo() === 'barbar2' )
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
    assert( f instanceof Foo )
    assert( f.foo() === 'it works' )

    const Bar = Foo.subclass({
        public: Protected => ({
            test() {
                return Protected(this).test()
            }
        }),
        protected: ({Super, Public}) => ({
            test() {
                return Super(Public(this)).foo()
                //return Public(Super(this)).foo() // TODO: should this work?
            }
        })
    })

    const b = new Bar
    assert( b instanceof Bar )
    assert( b.foo() === 'it works' )
}

// ##################################################
// static members and static inheritance (only public for now, TODO:
// protected/private static members)
{
    const Foo = Class()
    Foo.foo = 'foo'
    Foo.getFoo = function() { return this.foo }

    const Bar = Class().extends(Foo)
    assert( Bar.getFoo() === 'foo' )

    const Baz = Class().extends(Foo, {
        constructor() {}
    })
    assert( Baz.getFoo() === 'foo' )

    // extends Object by default, but doesn't inherit static features, similar to `class {}`
    let Lorem = Class()
    let l = new Lorem
    assert( l instanceof Object && typeof l.hasOwnProperty === 'function' )
    assert( typeof Lorem.create === 'undefined' )

    // extending Object directly inherits static features, similar to `class extends Object {}`
    Lorem = Class().extends( Object )
    l = new Lorem
    assert( l instanceof Object && typeof l.hasOwnProperty === 'function' )
    assert( typeof Lorem.create === 'function' )
}

// ##################################################
// make sure generated constructor has same `.length` as the supplied
// constructor
{
    const Foo = Class({
        constructor( a, b, c, d ) { },
    })

    assert( Foo.length === 4 )
}


// ##################################################
// make sure calling a super method that isn't on the direct parent class works
// (f.e. a grand parent method will be called if the parent class doesn't have
// the method)
{
    const Foo = Class({
        method() {
            return 'it works'
        }
    })

    const Bar = Class().extends(Foo)

    const Baz = Class().extends(Bar, ({Super}) => ({
        test() {
            return Super(this).method()
        }
    }))

    const b = new Baz

    assert( b.test() === 'it works' )
}

// ##################################################
// make sure getters/setters work
{
    const Foo = Class(({Protected}) => ({
        get foo() {
            return Protected(this).foo
        },
        set foo( value ) {
            Protected(this).foo = value
        },
    }))

    const f = new Foo

    f.foo = 1

    assert( f.foo === 1 )

    const Bar = Class().extends(Foo, {
        test() {
            this.foo = 10
            return this.foo
        }
    })

    const bar = new Bar

    assert( bar.test() === 10 )

    const Baz = Class().extends(Foo, ({Super}) => ({
        test() {
            Super(this).foo = 20
            return Super(this).foo
        }
    }))

    const baz = new Baz

    assert( baz.test() === 20 )

    let count = 0

    const Lorem = Class().extends(Foo, ({Super, Protected}) => ({
        get foo() {
            count++
            return Super(this).foo
        },
        set foo( value ) {
            count++
            Super(this).foo = value
        },
        protectedFoo() {
            return Protected(this).foo
        },
    }))

    const l = new Lorem

    l.foo = 15
    assert( l.foo === 15 )
    assert( count === 2 )
    assert( l.protectedFoo() === 15 )

    const Ipsum = Class().extends(Lorem, (Public, Protected) => ({
        protected: {
            get bar() {
                return Public(this).foo * 2
            },
            set bar( value ) {
                Public(this).foo = value
            },
        },

        test() {
            Protected(this).bar = 50
            return Protected(this).bar
        },
    }))

    const i = new Ipsum

    i.foo = 33
    assert( i.foo === 33 )
    assert( count === 4 )
    assert( i.test() === 100 )
    assert( i.protectedFoo() === 50 )
}

// ##################################################
// Make sure that the 'private' and 'protected' prototype objects are not
// visible on the 'public' prototype (implementation was exposing it in the
// case no `public` object was supplied, in which case the base definition
// object is used as the public prototype).
{
    const definition = {
        foo: 'foo',
        protected: {
            bar: 'bar'
        },
        private: {
            baz: 'baz'
        },
    }

    const Foo = Class( definition )

    // lowclass uses the class definition as the class prototype directly (this
    // allows `super` to work in ES6+ environments)
    assert( Foo.prototype === definition )

    // lowclass also uses the protected and private sub-objects as the internal
    // protected and private prototypes as well, but they shouldn't be visible
    // on the public prototype:
    assert( typeof definition.protected === 'undefined' )
    assert( typeof Foo.prototype.protected === 'undefined' )
    assert( typeof definition.private === 'undefined' )
    assert( typeof Foo.prototype.private === 'undefined' )

    // prove the previous comment about directly using protected and private
    // sub-objects as prototypes is true {

    const protectedDefinition = { bar: 'bar' }
    const privateDefinition = { baz: 'baz' }

    const Bar = Class((Public, Protected, Private) => ({
        foo: 'foo',

        test() {
            return [ Protected(this), Private(this) ]
        },

        protected: protectedDefinition,
        private: privateDefinition,
    }))

    const b = new Bar

    assert( b.test()[0].__proto__ === protectedDefinition )
    assert( b.test()[1].__proto__ === privateDefinition )

    // }
}

// ##################################################
// extend es2015-style classes that were made with native `class` syntax, and
// using Super helper
{
    class Foo {
        constructor( msg ) {
            this.message = msg
        }

        method() {
            return this.message
        }
    }

    // TODO auto-detect `class`es
    const Bar = Class().extends( native(Foo), ({Super}) => ({
        constructor( msg ) {
            Super(this).constructor( msg )

            this.message += '!'
        },

        method() {
            return Super(this).method()
        },
    }))

    const b = new Bar( 'it works' )

    assert( b instanceof Bar )
    assert( b instanceof Foo )
    assert( b.method() === 'it works!' )
}

// ##################################################
// extend es2015-style classes that were made with native `class` syntax, and
// using native `super`
{
    class Foo {
        constructor( msg ) {
            this.message = msg
        }

        method() {
            return this.message
        }
    }

    const Bar = Class().extends( native(Foo), {
        constructor( msg ) {
            super.constructor( msg )

            this.message += '!'
        },

        method() {
            return super.method()
        },
    })

    const b = new Bar( 'it works' )

    assert( b instanceof Bar )
    assert( b instanceof Foo )
    assert( b.method() === 'it works!' )
}

// ##################################################
// behavior that is different from original newless:
{
    // this shows original behavior (conditions negated to pass)

    class Foo {}

    const _Foo = native(Foo)
    assert( !( _Foo.prototype === Foo.prototype ) )
    assert( !( _Foo.prototype.constructor === Foo ) )

    const f = new _Foo()
    assert(f instanceof Foo)
    assert(f instanceof _Foo)
    assert( !( f.constructor !== _Foo ) )
    assert( !( f.constructor === Foo ) )
}
{
    // this shows the new behavior

    class Foo {}

    const _Foo = native(Foo)
    assert(_Foo.prototype === _Foo.prototype)
    assert(_Foo.prototype.constructor === _Foo)

    const f = new _Foo()
    assert(f instanceof Foo)
    assert(f instanceof _Foo)
    assert(f.constructor === _Foo)
    assert(f.constructor !== Foo)
}

// ##################################################
// assert that the protected instance in different code of a class hierarchy
// are the same instance.
{
    let fooProtectedGetter
    let fooProtected
    const Foo = Class((Public, Protected) => {
        fooProtectedGetter = Protected
        Protected.prototype.foo = 'foo'
        Public.prototype.constructor = function() {
            fooProtected = Protected(this)
        }
    })

    let barProtectedGetter
    let barProtected
    const Bar = Class().extends(Foo, ({Super, Public, Protected}) => {
        barProtectedGetter = Protected
        Protected.prototype.bar = 'bar'
        Public.prototype.constructor = function() {
            Super(this).constructor()
            barProtected = Protected(this)
        }
        Public.prototype.test = function() {
            const f = new Foo
            Protected(f)
        }
    })

    assert( fooProtectedGetter !== barProtectedGetter )

    const f = new Foo
    const b = new Bar

    assert( fooProtected === barProtected )
    assert( fooProtectedGetter(b) === barProtectedGetter(b) )

    // XXX 
    try {
        b.test()
        throw 'fail'
    }
    catch (e) {
        if ( !( e instanceof InvalidAccessError ) )
            throw e
    }
}

// ##################################################
// make sure constructor is not writable or configurable
~function() {
    "use strict"

    let ctor = 'supercalifragilisticexpialidocious'
    let Duck
    let errorThrown = false

    try {
        Duck = Class({
            constructor() {}
        })

        ctor = Duck.prototype.constructor
        Duck.prototype.constructor = function() {}
    }
    catch(e) {
        assert( Duck.prototype.constructor === ctor )
        errorThrown = true
    }

    assert(errorThrown, 'should not reach here if constructor is not writable')
}()

console.log('')
console.log(' All tests passed! ')
