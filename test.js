const { Class, createClassHelper, InvalidAccessError } = require('./src/index')

const assert = console.assert.bind( console )

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

    const Dog = Class('Dog', (Public, Protected, Private) => ({
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
    const Dog = Class('Dog', (Public, Protected, Private) => {
        Protected.sound = "Woof!"
    })

    const UnrelatedClass = Class(function UnrelatedClass(Public, Protected, Private) {
        Public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', Protected(dog).sound)
        }
    })

    let u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( !( e instanceof InvalidAccessError ) )
        throw e
}

// ##################################################
// we should not be able to access private members from an unrelated class
try {
    const Dog = Class('Dog', (Public, Protected, Private) => {
        Private.breed = "labrador"
    })

    const UnrelatedClass = Class(function UnrelatedClass(Public, Protected, Private) {
        Public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', Private(dog).breed)
        }
    })

    const u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( !( e instanceof InvalidAccessError ) )
        throw e
}

// ##################################################
// we can access a child class protected member from a super class
{
    const Animal = Class('Animal', (Public, Protected, Private) => ({
        getDogSound: function talk() {
            const dog = new Dog
            return Protected(dog).sound
        },
    }))

    const Dog = Animal.subclass('Dog', (Public, Protected) => {
        Protected.sound = "Woof!"
    })

    const animal = new Animal
    const dogSound = animal.getDogSound()

    console.assert( dogSound === 'Woof!' )
}

// ##################################################
// we can access a super class protected member from a child class
{
    const Animal = Class('Animal', (Public, Protected, Private) => {
        Protected.alive = true
    })

    const Dog = Animal.subclass('Dog', (Public, Protected) => ({
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

    const Animal = Class('Animal', (Public, Protected, Private) => ({
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
                dog.checkBar()

                Private(this).bar = 'of soap'
                dog.checkBar()

                dog.exposePrivate()
                assert( Private(dog) !== dogPrivate )
                assert( Private(this) !== dogPrivate )
                assert( Private(this) !== Private(dog) )
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    let dogPrivate = null

    const Dog = Animal.subclass(function Dog(Public, Protected, Private) {
        Private.sound = "Woof!"
        Public.verifySound = function() {
            console.assert( Private(this).sound === 'Woof!' )
        }
        Public.changeSound = function() {
            Private(this).sound = "grrr!"
        }
        Public.checkBar = function() {
            assert( Private(this).bar === undefined )
        }
        Public.exposePrivate = function() {
            dogPrivate = Private(this)
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()
}

// ##################################################
// we can not access a parent class' private member from a child class
{

    const Animal = Class('Animal', (Public, Protected, Private) => ({
        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(Public, Protected, Private) {
        Private.sound = "Woof!"
        Public.foo = function() {

            // should not be able to access Animal's private bar property
            console.assert( Private(this).bar === undefined )
            console.assert( this.bar === undefined )
        }
    })

    const dog = new Dog
    dog.foo()
}

// ##################################################
// further example, private members are isolated to their classes
{

    const Animal = Class('Animal', (Public, Protected, Private) => ({
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

    const Dog = Animal.subclass('Dog', (Public, Protected, Private) => ({
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

    const Dog = Class(function Dog(Public, Protected, Private) {
        Private.sound = "Woof!"
        Public.talk = function() {
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

    const SubClass = SomeClass.subclass((Public, Protected, Private, _super) => ({

        publicMethod() {
            _super(this).publicMethod()
        },

        protected: {

            protectedMethod() {
                console.log('extending a protected method')
                _super(this).protectedMethod()
            },

        },

        //private: {

            //privateMethod() {
                //SomeClass.prototype.privateMethod.call(this)
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
    const SomeClass = Class((Public, Protected, Private) => ({

        // default access is public, like C++ structs
        publicMethod() {
            console.log('base class publicMethod')
            Protected(this).protectedMethod()
        },

        checkPrivateProp() {
            console.assert( Private(this).lorem === 'foo' )
        },

        protected: {
            protectedMethod() {
                console.log('base class protectedMethod:', Private(this).lorem)
                Private(this).lorem = 'foo'
            },
        },

        private: {
            lorem: 'blah',
        },
    }))

    const SubClass = SomeClass.subclass((Public, Protected, Private, _super) => ({

        publicMethod() {
            _super(this).publicMethod()
            console.log('extended a public method')
            Private(this).lorem = 'baaaaz'
            this.checkPrivateProp()
        },

        checkPrivateProp() {
            _super(this).checkPrivateProp()
            console.assert( Private(this).lorem === 'baaaaz' )
        },

        protected: {

            protectedMethod() {
                _super(this).protectedMethod()
                console.log('extended a protected method')
            },

        },

        private: {
            lorem: 'bar',
        },
    }))

    const GrandChildClass = SubClass.subclass((Public, Protected, Private, _super) => ({

        test() {
            Private(this).begin()
        },

        reallyBegin() {
            Protected(this).reallyReallyBegin()
        },

        protected: {
            reallyReallyBegin() {
                _super(Public(this)).publicMethod()
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
    const A = Class((Public, Protected, Private) => ({
        foo: function (n) { return n }
    }))

    const B = A.subclass((Public, Protected, Private, _super) => ({
        foo: function (n) {
            if (n > 100) return -1;
            return _super(this).foo(n+1);
        }
    }))

    const C = B.subclass((Public, Protected, Private, _super) => ({
        foo: function (n) {
            return _super(this).foo(n+2);
        }
    }))

    var c = new C();
    assert( c.foo(0) === 3 )
}

// ##################################################
// Slightly modifying the previous example, show that builtin `super` also
// works (for ES6+ environments)
{
    const A = Class((Public, Protected, Private) => ({
        foo: function (n) { return n }
    }))

    const B = A.subclass((Public, Protected, Private) => ({
        foo(n) {
            if (n > 100) return -1;
            return super.foo(n+1);
        }
    }))

    const C = B.subclass((Public, Protected, Private) => ({
        foo(n) {
            return super.foo(n+2);
        }
    }))

    var c = new C();
    assert( c.foo(0) === 3 )
}

// ##################################################
// leaking private of another class, showing that different private scope is
// accessed. We might call this pattern "module private".
{
    let fooPrivate

    const Foo = Class((Public, Protected, Private) => {
        fooPrivate = Private

        Private.foo = "foo"
    })

    const Bar = Foo.subclass((Public, Protected, Private) => ({
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
                assert( Protected(this).foo() === 'bar' )
                assert( Private(this).foo() === 'bar' )
                return 'it works'
            },
        }),
        protected: (Public, Private) => ({
            foo() {
                return Public(this).bar
            }
        }),
        private: (Public, Protected) => ({
            foo() {
                return Public(this).bar
            }
        }),
    })

    const f = new Foo
    assert( f instanceof Foo )
    assert( f.foo() === 'it works' )
}

// ##################################################
// static props and methods (only public for now, TODO)
{
    const Foo = Class()
    Foo.foo = 'foo'
    Foo.getFoo = function() { return this.foo }

    const Bar = Class().extends(Foo)
    assert( Bar.getFoo() === 'foo' )

    // extends Object by default, but doesn't inherit library features, similar to `class {}`
    let Lorem = Class()
    let l = new Lorem
    assert( l instanceof Object && typeof l.hasOwnProperty === 'function' )
    assert( typeof Lorem.create === 'undefined' )

    // extending Object directly inherits library features, similar to `class extends Object {}`
    Lorem = Class().extends( Object )
    l = new Lorem
    assert( l instanceof Object && typeof l.hasOwnProperty === 'function' )
    assert( typeof Lorem.create === 'function' )
}

console.log('')
console.log(' All tests passed! ')
