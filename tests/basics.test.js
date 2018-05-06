
import {
    Class,
    InvalidAccessError,
    InvalidSuperAccessError,
} from '../src/index'

import { native } from '../src/native'

const test = it

describe( 'basics', () => {

    test('only public members can be read/written from outside code', () => {

        const Dog = Class('Dog', ({Protected, Private}) => ({
            setFoo() {
                this.foo = 'woo hoo'
            },
            checkFoo() {
                expect( this.foo === 'weee' ).toBeTruthy()
            },
            setBar() {
                Protected(this).bar = 'yippee'
            },
            checkBar() {
                expect( Protected(this).bar === 'yippee' ).toBeTruthy()
            },
            setBaz() {
                Private(this).baz = 'oh yeah'
            },
            checkBaz() {
                expect( Private(this).baz === 'oh yeah' ).toBeTruthy()
            },
        }))

        const dog = new Dog
        dog.setFoo()
        dog.foo = 'weee'
        expect( dog.foo === 'weee' ).toBeTruthy()
        dog.checkFoo()

        dog.bar = 'yoohoo'
        dog.setBar()
        expect( dog.bar === 'yoohoo' ).toBeTruthy()
        dog.checkBar()

        dog.baz = 'hee hee'
        dog.setBaz()
        expect( dog.baz === 'hee hee' ).toBeTruthy()
        dog.checkBaz()
    })

    test('we should not be able to access protected members from an unrelated class', () => {

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

        expect(() => {
            u.testInvalidAccess()
        }).toThrowError(InvalidAccessError)

    })

    test('we should not be able to access private members from an unrelated class', () => {

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

        expect(() => {
            u.testInvalidAccess()
        }).toThrowError(InvalidAccessError)

    })

    test('we can access a child class protected member from a super class', () => {

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

        expect( dogSound === 'Woof!' ).toBeTruthy()
    })

    test('we can access a super class protected member from a child class', () => {

        const Animal = Class('Animal', ({Protected}) => {
            Protected.prototype.alive = true
        })

        const Dog = Animal.subclass('Dog', ({Protected}) => ({
            isAlive() {
                return Protected(this).alive
            }
        }))

        const dog = new Dog
        expect( dog.isAlive() === true ).toBeTruthy()
    })

    test("we can not access a private member of an instance of a child class from a parent class instance", () => {

        let AnimalPrivate = null

        const Animal = Class('Animal', ({Private}) => {

            AnimalPrivate = Private

            return {
                public: {
                    foo: function talk() {
                        const dog = new Dog

                        // like in C++, accessing the private variable of a child class does not work.
                        expect( Private(dog).sound === undefined ).toBeTruthy()

                        // like in C++, we can only access the private members associated with the class that we are currently in:
                        expect( Private(dog).bar === 'BAR' ).toBeTruthy()

                        Private(dog).sound = 'Awoooo!'
                        dog.verifySound()
                        dog.changeSound()
                        expect( Private(dog).sound === 'Awoooo!' ).toBeTruthy()

                        Private(dog).bar = 'of soap'
                        dog.checkBar() // dog's is still "BAR"

                        Private(this).bar = 'of soap'
                        dog.checkBar() // dog's is still "BAR"

                        dog.exposePrivate()
                        expect( Private(dog) !== dogPrivate ).toBeTruthy()
                        expect( Private(this) !== dogPrivate ).toBeTruthy()
                        expect( Private(this) !== Private(dog) ).toBeTruthy()
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
                expect( Private(this).sound === 'Woof!' ).toBeTruthy()
            }
            Public.prototype.changeSound = function() {
                Private(this).sound = "grrr!"
            }
            Public.prototype.checkBar = function() {

                // the private instance for the Dog class is not the same instance a for the Animal class
                expect( Private(this) !== AnimalPrivate(this) ).toBeTruthy()

                // private bar was inherited, but the instance is still private
                expect( Private(this).bar === 'BAR' ).toBeTruthy()

                // and therefore this value is different, because it's a different instance
                expect( AnimalPrivate(this).bar === 'of soap' ).toBeTruthy()
            }
            Public.prototype.exposePrivate = function() {
                dogPrivate = Private(this)
            }
        })

        const animal = new Animal('Ranchuu')
        animal.foo()
    })

    test("we can not access a private member of an instance of a parent class from a child class instance", () => {

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
                expect( Private(this).bar === 'BAR' ).toBeTruthy()

                expect( this.bar === undefined ).toBeTruthy()
            }
        })

        const dog = new Dog
        dog.foo()
    })

    test('further example, private members are isolated to their classes', () => {

        const Animal = Class('Animal', ({Private}) => ({
            public: {
                test: function() {
                    const dog = new Dog
                    dog.bar = 'bar'
                    dog.setBar()
                    expect( Private(this).bar === 'oh yeah' ).toBeTruthy()
                    Private(this).bar = 'mmm hmmm'
                    dog.checkBar()
                    expect( Private(this).bar === 'mmm hmmm' ).toBeTruthy()
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
                expect( Private(this).bar === 'yippee' ).toBeTruthy()
                Private(this).bar = 'woohoo'
            },
        }))

        const animal = new Animal
        animal.foo = 'foo'
        animal.test()
    })

    const publicAccesses = []
    const protectedAccesses = []
    const privateAccesses = []

    let SomeClassPrivate
    let someClassPublicInstance
    let someClassProtectedInstance
    let someClassPrivateInstance

    let foundPrivate

    const SomeClass = Class('SomeClass', (Public, Protected, Private) => {

        SomeClassPrivate = Private

        return {
            foo: 'foo',

            constructor() {
                someClassPublicInstance = this
                someClassProtectedInstance = Protected(this)
                someClassPrivateInstance = Private(this)
            },

            publicMethod: function() {
                expect( this === Public(this) ).toBeTruthy()
                expect( this.foo === Public(this).foo ).toBeTruthy()

                expect( this.foo === 'foo' ).toBeTruthy()
                expect( Public(this).foo === 'foo' ).toBeTruthy()
                expect( Protected(this).bar === 'bar' ).toBeTruthy()
                expect( Private(this).baz === 'baz' ).toBeTruthy()

                expect( Public(this) !== Protected(this) ).toBeTruthy()
                expect( Public(this) !== Private(this) ).toBeTruthy()
                expect( Protected(this) !== Private(this) ).toBeTruthy()

                publicAccesses.push( Public(this) )
                protectedAccesses.push( Protected(this) )
                privateAccesses.push( Private(this) )

                Protected(this).protectedMethod()
            },

            protected: {
                bar: 'bar',

                protectedMethod: function() {
                    expect( this === Protected(this) ).toBeTruthy()
                    expect( this.bar === Protected(this).bar ).toBeTruthy()

                    expect( this.bar === 'bar' ).toBeTruthy()
                    expect( Public(this).foo === 'foo' ).toBeTruthy()
                    expect( Protected(this).bar === 'bar' ).toBeTruthy()
                    expect( Private(this).baz === 'baz' ).toBeTruthy()

                    expect( Protected(this) !== Public(this) ).toBeTruthy()
                    expect( Protected(this) !== Private(this) ).toBeTruthy()
                    expect( Public(this) !== Private(this) ).toBeTruthy()

                    publicAccesses.push( Public(this) )
                    protectedAccesses.push( Protected(this) )
                    privateAccesses.push( Private(this) )

                    // this is calling SomeClass.privateMethod in the scope of SomeClass
                    Private(this).privateMethod()
                },
            },

            private: {
                baz: 'baz',

                privateMethod: function() {
                    foundPrivate = Private(this)
                    expect( this === Private(this) ).toBeTruthy()
                    expect( this.baz === Private(this).baz ).toBeTruthy()

                    expect( this.baz === 'baz' ).toBeTruthy()
                    expect( Public(this).foo === 'foo' ).toBeTruthy()
                    expect( Protected(this).bar === 'bar' ).toBeTruthy()
                    expect( Private(this).baz === 'baz' ).toBeTruthy()

                    expect( Private(this) !== Public(this) ).toBeTruthy()
                    expect( Private(this) !== Protected(this) ).toBeTruthy()
                    expect( Public(this) !== Protected(this) ).toBeTruthy()

                    publicAccesses.push( Public(this) )
                    protectedAccesses.push( Protected(this) )
                    privateAccesses.push( Private(this) )
                },
            },
        }
    })

    test('check that various ways to access public/protected/private members work inside a single base class', () => {

        const o = new SomeClass
        o.publicMethod()

        expect( o.protectedMethod === undefined ).toBeTruthy()
        expect( o.privateMethod === undefined ).toBeTruthy()

        expect( publicAccesses.length === 3 ).toBeTruthy()
        expect( protectedAccesses.length === 3 ).toBeTruthy()
        expect( privateAccesses.length === 3 ).toBeTruthy()

        expect( publicAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) ).toBeTruthy()
        expect( protectedAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) ).toBeTruthy()
        expect( privateAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) ).toBeTruthy()

        publicAccesses.length = 0
        protectedAccesses.length = 0
        privateAccesses.length = 0
    })

    test('check that various ways to access public/protected/private members work inside a subclass', () => {

        let subClassPublicInstance
        let subClassProtectedInstance
        let subClassPrivateInstance

        const SubClass = SomeClass.subclass(({Super, Private, Protected}) => ({

            constructor() {
                Super(this).constructor()

                subClassPublicInstance = this
                subClassProtectedInstance = Protected(this)
                subClassPrivateInstance = Private(this)
            },

            publicMethod() {
                Super(this).publicMethod()
            },

            protected: {

                protectedMethod() {
                    Super(this).protectedMethod()
                    Private(this).privateMethod()
                },

            },

            private: {

                privateMethod() {

                    // Private Inheritance!
                    //
                    // This is calling SomeClass.privateMethod in the scope of
                    // SubClass, so any operations on private members will be
                    // on the private members of SubClass (members which have
                    // been in herited from SomeClass).
                    Super(this).privateMethod()

                    // This helps explain the magic regarding Private Inheritance
                    //
                    // this proves that private functionality works like
                    // `private` in C++, except that functionality can be
                    // inherited, and the inherited functionality operates on
                    // the private data of the class that initiated the method
                    // call (in this case SubClass initiated the call to
                    // SomeClass.privateMethod with Super(this).privateMethod(), so if
                    // SomeClass.privateMethod modifies any private data, it
                    // will modify the data associated with SubClass, not
                    // SomeClass).
                    expect( this ).toBe( SomeClassPrivate(this) )
                    expect( this ).not.toBe( someClassPrivateInstance )

                    // (Just in case you didn't realize yet, `this` is
                    // equivalent to `Private(this)` in a private method)
                    expect( this ).toBe( Private(this) )

                },

            },

        }))

        const o = new SubClass
        o.publicMethod()

        expect( publicAccesses.length === 4 ).toBeTruthy()
        expect( protectedAccesses.length === 4 ).toBeTruthy()
        expect( privateAccesses.length === 4 ).toBeTruthy()

        expect( publicAccesses.every( instance => instance === subClassPublicInstance ) ).toBeTruthy()
        expect( protectedAccesses.every( instance => instance === subClassProtectedInstance ) ).toBeTruthy()

        // this is where things diverge from the previous baseclass test,
        // giving you a hint at how Private Inheritance works
        //
        // the first time SomeClass.privateMethod is called, it is called in
        // the scope of SomeClass, so Private(this) in that method refers to
        // the private members of SomeClass.
        privateAccesses.slice(0, 3).forEach( instance => expect( instance ).toBe( someClassPrivateInstance ) )
        //
        // and the second time SomeClass.privateMethod is called, it is called
        // in the scope of SubClass (as Super(this).privateMethod()) so in this
        // case Private(this) in that method refers to the private members of
        // SubClass, and if the method modifies any data, it will modify data
        // associated with SubClass, not SomeClass)
        expect( privateAccesses[3] === subClassPrivateInstance )

        publicAccesses.length = 0
        protectedAccesses.length = 0
        privateAccesses.length = 0
    })

    test('Show how Super works with private members (Private Inheritance)', () => {

        const Foo = Class(({Private, Protected, Public}) => ({
            fooThought() {
                return Private(this).thought
            },

            modifyPrivateDataInFoo() {
                Private(this).think( 'hmmmmm' )
            },

            private: {
                thought: 'weeeee',

                think( value ) {
                    this.thought = value
                },
            }
        }))

        const Bar = Class().extends(Foo, ({Private, Super}) => ({
            barThought() {
                return Private(this).thought
            },

            modifyPrivateDataInBar() {
                Private(this).thinkAgain( 'yeaaaaah' )
            },

            private: {

                // Thought you knew private members? Think again!
                thinkAgain( value ) {
                    // code re-use, but modifies data of Bar class, not Foo class
                    Super(this).think( value )
                }

            }
        }))

        const b = new Bar

        // shows that the initial private value of `thought` in Bar is
        // inherited from Foo
        expect( b.fooThought() ).toBe( 'weeeee' )
        expect( b.barThought() ).toBe( 'weeeee' )

        b.modifyPrivateDataInFoo()
        b.modifyPrivateDataInBar()

        // the private member in Foo hasn't changed:
        expect( b.fooThought() ).toBe( 'hmmmmm' )

        // but the private member in Bar has:
        expect( b.barThought() ).toBe( 'yeaaaaah' )

        // native `super` works too:
        const Baz = Class().extends(Bar, ({Super}) => ({
            private: {
                think() {
                    super.think()
                }
            }
        }))

        const baz = new Baz

        expect( baz.fooThought() ).toBe( 'weeeee' )
        expect( baz.barThought() ).toBe( 'weeeee' )

        baz.modifyPrivateDataInFoo()
        baz.modifyPrivateDataInBar()

        // oh yes! This is great!
        expect( baz.fooThought() ).toBe( 'hmmmmm' )
        expect( baz.barThought() ).toBe( 'yeaaaaah' )
    })

    test('double check: super spaghetti soup works', () => {

        // I like super spaghetti soup.

        const SomeClass = Class(({Protected, Private}) => ({

            // default access is public, like C++ structs
            publicMethod() {
                Protected(this).protectedMethod()
            },

            checkPrivateProp() {
                expect( Private(this).lorem === 'foo' ).toBeTruthy()
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
                expect( Private(this).lorem === 'baaaaz' ).toBeTruthy()
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

        expect( typeof o.test === 'function' ).toBeTruthy()
        expect( o.reallyReallyBegin === undefined ).toBeTruthy()
        expect( o.begin === undefined ).toBeTruthy()
    })

    test('static members and static inheritance', () => {

        // only public access for static members for now (TODO protected/private)

        const Car = Class({
            wheels: [1,2,3,4],
            static: {
                isCar( obj ) {
                    return obj.wheels.length === 4
                }
            }
        })

        const car = new Car
        expect( Car.isCar( car ) ).toBeTruthy()

        const Buggy = Class().extends(Car)

        const buggy = new Car
        expect( Car.isCar( buggy ) ).toBeTruthy()

        // inheritance
        const DuneBuggy = Class().extends(Buggy)
        expect( DuneBuggy.isCar( buggy ) ).toBe( true )
    })

    test("implicitly extending Object doesn't inherit static members, like ES6 classes", () => {

        // extends Object by default, but doesn't inherit static features,
        // similar to ES6 `class {}`
        const Lorem = Class()
        const l = new Lorem

        // we have Object prototype methods
        expect( l instanceof Object && typeof l.hasOwnProperty === 'function' ).toBeTruthy()

        // but not static methods
        expect( typeof Lorem.create === 'undefined' ).toBeTruthy()

    })

    test("explicitly extending Object inherits static members, like ES6 classes", () => {

        // extending Object directly inherits static features, similar to
        // `class extends Object {}`
        const Lorem = Class().extends( Object )
        const l = new Lorem

        // we have Object prototype methods
        expect( l instanceof Object && typeof l.hasOwnProperty === 'function' ).toBeTruthy()

        // and static methods
        expect( typeof Lorem.create === 'function' ).toBeTruthy()

    })

    test("make sure generated constructor has same `.length` as the supplied constructor", () => {

        const Foo = Class({
            constructor( a, b, c, d ) { },
        })

        expect( Foo.length === 4 ).toBeTruthy()
    })


    test("make sure calling a super method that isn't on the direct parent class works", () => {
        // (f.e. a grand parent method will be called if the parent class doesn't
        // have the method)

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

        expect( b.test() === 'it works' ).toBeTruthy()
    })

    test("make sure getters/setters work", () => {

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

        expect( f.foo === 1 ).toBeTruthy()

        const Bar = Class().extends(Foo, {
            test() {
                this.foo = 10
                return this.foo
            }
        })

        const bar = new Bar

        expect( bar.test() === 10 ).toBeTruthy()

        const Baz = Class().extends(Foo, ({Super}) => ({
            test() {
                Super(this).foo = 20
                return Super(this).foo
            }
        }))

        const baz = new Baz

        expect( baz.test() === 20 ).toBeTruthy()

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
        expect( l.foo === 15 ).toBeTruthy()
        expect( count === 2 ).toBeTruthy()
        expect( l.protectedFoo() === 15 ).toBeTruthy()

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
        expect( i.foo === 33 ).toBeTruthy()
        expect( count === 4 ).toBeTruthy()
        expect( i.test() === 100 ).toBeTruthy()
        expect( i.protectedFoo() === 50 ).toBeTruthy()
    })

    test("show that the protected instance in different code of a class hierarchy are the same instance", () => {

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

        expect( fooProtectedGetter !== barProtectedGetter ).toBeTruthy()

        const f = new Foo
        const b = new Bar

        expect( fooProtected === barProtected ).toBeTruthy()
        expect( fooProtectedGetter(b) === barProtectedGetter(b) ).toBeTruthy()

        expect(() => {
            b.test()
        }).toThrowError(InvalidAccessError)
    })

    test("valid vs invalid Super access", () => {

        //const verifyDimensionCall = jest.fn()
        const verifyDimensionCall = jasmine.createSpy()

        // PhysicalObject implicitly extends from Object (no pun intended!):
        const PhysicalObject = Class({
            getDimensions() {

                // see below
                expect( this instanceof Piano ).toBeTruthy()

                verifyDimensionCall()

            }
        })

        const Instrument = Class().extends(PhysicalObject, ({Super}) => ({
            sound: '',

            makeSound() {
                return this.sound
            },

            testFromInstrumentClass() {
                const piano = new Piano

                // This Super call works because piano is instance of
                // Instrument, but the Super will be relative to this class
                // (Instrument). Because Instrument inherits from
                // PhysicalObject, calling `Super(piano)` will give you access
                // to PhysicalObject properties and methods with piano as
                // context.
                //
                // Who knows, there might be some interesting use case for
                // being able to call super on some other instance,
                // something that we can't do with native `super`, and this
                // doesn't break the protected or private API access
                // contracts.
                //
                expect( Super(piano).makeSound ).toBe( undefined )
                Super(piano).getDimensions()

                // Do you want a super piano?
            },
        }))

        const Piano = Class().extends(Instrument, {
            sound: 'ping' // how do you describe piano sound?
        })

        const Oboe = Class().extends(Instrument, ({Super}) => ({

            sound: 'wooo', // or an oboe sound?

            testFromOboeClass() {

                const piano = new Piano

                expect(() => {

                    // fails because piano isn't an instance of Oboe, so there
                    // isn't any set of super props/methods for piano based on
                    // the scope of the Oboe class.
                    Super(piano).makeSound()

                }).toThrowError(InvalidSuperAccessError)

                // wish I had a super piano.

                let sound

                expect(() => {

                    sound = Super(this).makeSound()

                }).not.toThrow()

                // Oboes are already super though!

                return sound
            },

        }))

        const oboe = new Oboe()

        oboe.testFromInstrumentClass()
        expect( verifyDimensionCall ).toHaveBeenCalled()

        expect( oboe.testFromOboeClass() ).toBe( 'wooo' )
    })

    // Based on an example that's been floating around, f.e.  at
    // https://stackoverflow.com/a/11199220/454780 and other places
    test("there's no recursive problem, using Super helper", () => {

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
        expect( c.foo(0) === 3 ).toBeTruthy()
    })

    // Slightly modifying the previous example, using builtin `super` also works
    // (for ES6+ environments)
    test("there's no recursive problem, using native super", () => {

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
        expect( c.foo(0) === 3 ).toBeTruthy()
    })

    test('performing tricks with leaked access helpers', () => {

        // If we leak the access helper as follows, we can export imagine that we
        // can export multiple classes from a module file, so the members are still
        // private, but acecssible to all the classes in the file.  We could call
        // this pattern "module private".
        //
        // What could be a use case for this? It may be similar to package scope in
        // Java.

        let fooPrivate

        const Foo = Class(({Private}) => {
            fooPrivate = Private

            Private.prototype.foo = "foo"
        })

        const Bar = Foo.subclass(({Private}) => ({
            test() {
                expect( fooPrivate(this).foo === 'foo' ) // "foo".toBeTruthy()
                expect( Private(this).foo === 'bar' ) // "bar".toBeTruthy()
            },
            private: {
                foo: "bar"
            }
        }))

        const bar = new Bar
        bar.test()
    })

    test("'private' and 'protected' definition objects should not be left on the 'public' definition object", () => {
        // Make sure that the 'private' and 'protected' definition objects (when
        // defining a class, f.e. `protected: { ... }`) are not visible on the
        // 'public' prototype

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
        expect( Foo.prototype === definition ).toBeTruthy()

        // lowclass also uses the protected and private sub-objects as the internal
        // protected and private prototypes as well, but they shouldn't be visible
        // on the public prototype:
        expect( typeof definition.protected === 'undefined' ).toBeTruthy()
        expect( typeof Foo.prototype.protected === 'undefined' ).toBeTruthy()
        expect( typeof definition.private === 'undefined' ).toBeTruthy()
        expect( typeof Foo.prototype.private === 'undefined' ).toBeTruthy()

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

        expect( b.test()[0].__proto__ === protectedDefinition ).toBeTruthy()
        expect( b.test()[1].__proto__ === privateDefinition ).toBeTruthy()

        // }
    })

    test("using native `super` in public methods of a root definition object won't work if there's also a 'public' definition object", () => {

        const Person = Class({
            fly() { return 'fly' },
        })

        // does not (can not) work
        const Man = Class().extends(Person, {
            fly() {
                expect( super.fly ).toBe( undefined )
                return 'failed'
            },

            public: {
                unusedMethod() {}
            },
        })

        const man = new Man
        expect( man.fly() ).toBe( 'failed' )

        // works
        const SuperMan = Class().extends(Person, ({Super}) => ({
            fly() {
                return Super(this).fly()
            }
        }))

        const superman = new SuperMan
        expect( superman.fly() ).toBe( 'fly' )

        // I guess SuperMan is Super fly!
    })
} )
