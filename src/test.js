
"use strict"

const {
    Class,
    createClassHelper,
    InvalidAccessError,
    InvalidSuperAccessError,
    staticBlacklist,
} = require('./index')

const { native } = require('./native')

test('everything works', () => {

    // ##################################################
    // Example of extending Array
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

        const a = new MyArray
        expect( a instanceof Array ).toBeTruthy()
        expect( a instanceof MyArray ).toBeTruthy()

        expect( a.add(1,2,3) === 3 ).toBeTruthy()
        expect( a.length === 3 ).toBeTruthy()
        expect( a.concat(4,5,6).length === 6 ).toBeTruthy()
        expect( a.concat(4,5,6) instanceof MyArray ).toBeTruthy()
        expect( Array.isArray(a) ).toBeTruthy()
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
                    expect( this.foo === 'foo' ).toBeTruthy()
                    expect( Private(this).bar === 'bar' ).toBeTruthy()
                    expect( Protected(this).baz === 'baz' ).toBeTruthy()
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
                    expect( Private(this).who === 'you' ).toBeTruthy()
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
                expect( this.foo === 'foo' ).toBeTruthy()
                expect( Private(this).bar === 'bar' ).toBeTruthy()
                expect( Protected(this).baz === 'baz' ).toBeTruthy()
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
                    expect( Private(this).secret === 'he did it' ).toBeTruthy()
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
        expect( instance instanceof Constructor ).toBeTruthy()
        expect( Constructor.name === '' ).toBeTruthy()
        expect( Constructor.prototype.__proto__ === Object.prototype ).toBeTruthy()
    }

    // ##################################################
    // named empty base class
    {
        const Foo = Class("Foo")
        const foo = new Foo
        expect( foo instanceof Foo ).toBeTruthy()
        expect( Foo.name === "Foo" ).toBeTruthy()
        expect( Foo.prototype.__proto__ === Object.prototype ).toBeTruthy()
    }

    // ##################################################
    // anonymous non-empty base class
    {
        const Dog = Class(() => ({
            method() {}
        }))

        expect( Dog.name === "" ).toBeTruthy()
        expect( Dog.prototype.__proto__ === Object.prototype ).toBeTruthy()

        const dog = new Dog
        expect( dog instanceof Dog ).toBeTruthy()
        expect( typeof dog.method === 'function' ).toBeTruthy()
    }

    // ##################################################
    // named non-empty base class
    {
        const Dog = Class('Dog', () => ({
            method() {}
        }))

        expect( Dog.name === "Dog" ).toBeTruthy()
        expect( Dog.prototype.__proto__ === Object.prototype ).toBeTruthy()

        const dog = new Dog
        expect( dog instanceof Dog ).toBeTruthy()
        expect( typeof dog.method === 'function' ).toBeTruthy()
    }

    // ##################################################
    // anonymous empty subclass
    {
        const LivingThing = Class()
        const Alien = Class().extends(LivingThing)
        expect( Alien.name === "" ).toBeTruthy()
        expect( Alien.prototype.__proto__ === LivingThing.prototype ).toBeTruthy()

        const a = new Alien
        expect( a instanceof Alien ).toBeTruthy()
    }

    // ##################################################
    // named empty subclass
    {
        const LivingThing = Class("LivingThing")
        const Alien = Class("Alien").extends(LivingThing)
        expect( Alien.name === "Alien" ).toBeTruthy()
        expect( Alien.prototype.__proto__ === LivingThing.prototype ).toBeTruthy()

        const a = new Alien
        expect( a instanceof Alien ).toBeTruthy()
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
        expect( Alien.name === "" ).toBeTruthy()
        expect( Alien.prototype.__proto__ === LivingThing.prototype ).toBeTruthy()

        const a = new Alien
        expect( a instanceof Alien ).toBeTruthy()
        expect( a.method1 ).toBeTruthy()
        expect( a.method2 ).toBeTruthy()
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
        expect( Alien.name === "Alien" ).toBeTruthy()
        expect( Alien.prototype.__proto__ === LivingThing.prototype ).toBeTruthy()

        const a = new Alien
        expect( a instanceof Alien ).toBeTruthy()
        expect( typeof a.method1 === 'function' ).toBeTruthy()
        expect( typeof a.method2 === 'function' ).toBeTruthy()
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

        expect( Shark.name === "" ).toBeTruthy()
        expect( Shark.prototype.__proto__ === SeaCreature.prototype ).toBeTruthy()

        const shark = new Shark
        expect( shark instanceof Shark ).toBeTruthy()
        expect( typeof shark.method1 === 'function' ).toBeTruthy()
        expect( typeof shark.method2 === 'function' ).toBeTruthy()
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

        expect( Shark.name === "Shark" ).toBeTruthy()
        expect( Shark.prototype.__proto__ === SeaCreature.prototype ).toBeTruthy()

        const shark = new Shark
        expect( shark instanceof Shark ).toBeTruthy()
        expect( typeof shark.method1 === 'function' ).toBeTruthy()
        expect( typeof shark.method2 === 'function' ).toBeTruthy()
    }

    // ##################################################
    // only public members can be read/written from outside code
    {

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

        expect( dogSound === 'Woof!' ).toBeTruthy()
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
        expect( dog.isAlive() === true ).toBeTruthy()
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
                expect( Private(this).bar === 'BAR' ).toBeTruthy()

                expect( this.bar === undefined ).toBeTruthy()
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
    }

    // ##################################################
    // private members can be accessed only from the class where they are defined
    {

        const Dog = Class(function Dog({Public, Private}) {
            Private.prototype.sound = "Woof!"
            Public.prototype.talk = function() {
                expect( Private(this).sound === "Woof!" ).toBeTruthy()
            }
        })

        const dog = new Dog()

        // set public `sound` property
        dog.sound = 'awooo!'
        expect( dog.sound === 'awooo!' ).toBeTruthy()

        dog.talk()

    }

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

    // ##################################################
    // check that various ways to access public/protected/private members work inside a single base class
    {

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
    }

    // ##################################################
    // check that various ways to access public/protected/private members work inside a subclass
    {
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
    }

    // ##################################################
    // Show how Super works with private members (Private Inheritance)
    {
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
    }

    // ##################################################
    // there's no recursive problem (I've seen this example floating around, f.e.
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
        expect( c.foo(0) === 3 ).toBeTruthy()
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
        expect( c.foo(0) === 3 ).toBeTruthy()
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
                expect( fooPrivate(this).foo === 'foo' ) // "foo".toBeTruthy()
                expect( Private(this).foo === 'bar' ) // "bar".toBeTruthy()
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
                expect( this.bar === 'bar' ).toBeTruthy()
            },
        })

        const f = new Foo
        expect( f instanceof Foo ).toBeTruthy()
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

                    // this also works because Public returns whatever you pass
                    // in if it isn't a protected or private instance. Because,
                    // if you passed it in, it must already be public!
                    //return Public(Super(this)).foo()
                }
            })
        })

        const b = new Bar
        expect( b instanceof Bar ).toBeTruthy()
        expect( b.foo() === 'it works' ).toBeTruthy()
    }

    // ##################################################
    // static members and static inheritance (only public for now, TODO:
    // protected/private static members along with Super helper support)
    {
        const Foo = Class()
        Foo.foo = 'foo'
        Foo.getFoo = function() { return this.foo }

        const Bar = Class().extends(Foo)
        expect( Bar.getFoo() === 'foo' ).toBeTruthy()

        const Baz = Class().extends(Foo, {
            constructor() {}
        })
        expect( Baz.getFoo() === 'foo' ).toBeTruthy()

        // extends Object by default, but doesn't inherit static features, similar to `class {}`
        let Lorem = Class()
        let l = new Lorem
        expect( l instanceof Object && typeof l.hasOwnProperty === 'function' ).toBeTruthy()
        expect( typeof Lorem.create === 'undefined' ).toBeTruthy()

        // extending Object directly inherits static features, similar to `class extends Object {}`
        Lorem = Class().extends( Object )
        l = new Lorem
        expect( l instanceof Object && typeof l.hasOwnProperty === 'function' ).toBeTruthy()
        expect( typeof Lorem.create === 'function' ).toBeTruthy()
    }

    // ##################################################
    // shortcut for defining static members inside the class definition
    {
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
    }

    // ##################################################
    // make sure generated constructor has same `.length` as the supplied
    // constructor
    {
        const Foo = Class({
            constructor( a, b, c, d ) { },
        })

        expect( Foo.length === 4 ).toBeTruthy()
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

        expect( b.test() === 'it works' ).toBeTruthy()
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

        expect( b instanceof Bar ).toBeTruthy()
        expect( b instanceof Foo ).toBeTruthy()
        expect( b.method() === 'it works!' ).toBeTruthy()
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

        expect( b instanceof Bar ).toBeTruthy()
        expect( b instanceof Foo ).toBeTruthy()
        expect( b.method() === 'it works!' ).toBeTruthy()
    }

    // ##################################################
    // behavior that is different from original newless:
    {
        // this shows original behavior (conditions negated to pass)

        class Foo {}

        const _Foo = native(Foo)
        expect( !( _Foo.prototype === Foo.prototype ) ).toBeTruthy()
        expect( !( _Foo.prototype.constructor === Foo ) ).toBeTruthy()

        const f = new _Foo()
        expect(f instanceof Foo).toBeTruthy()
        expect(f instanceof _Foo).toBeTruthy()
        expect( !( f.constructor !== _Foo ) ).toBeTruthy()
        expect( !( f.constructor === Foo ) ).toBeTruthy()
    }
    {
        // this shows the new behavior

        class Foo {}

        const _Foo = native(Foo)
        expect(_Foo.prototype === _Foo.prototype).toBeTruthy()
        expect(_Foo.prototype.constructor === _Foo).toBeTruthy()

        const f = new _Foo()
        expect(f instanceof Foo).toBeTruthy()
        expect(f instanceof _Foo).toBeTruthy()
        expect(f.constructor === _Foo).toBeTruthy()
        expect(f.constructor !== Foo).toBeTruthy()
    }

    // ##################################################
    // expect that the protected instance in different code of a class hierarchy.toBeTruthy()
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

        expect( fooProtectedGetter !== barProtectedGetter ).toBeTruthy()

        const f = new Foo
        const b = new Bar

        expect( fooProtected === barProtected ).toBeTruthy()
        expect( fooProtectedGetter(b) === barProtectedGetter(b) ).toBeTruthy()

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
    // ensure that class prototype and static descriptors are like ES6 classes
    {

        const Duck = Class(({Protected, Private}) => ({
            constructor() {},
            add() {},
            get foo() {},

            protected: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            private: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            static: {
                foo: 'foo',
                add() {},
                set foo(v) {},
            },

            test() {
                checkDescriptors( Protected(this).__proto__ )
                checkDescriptors( Private(this).__proto__ )
            },
        }))

        const protoDescriptor = Object.getOwnPropertyDescriptor( Duck, 'prototype' )
        expect( !protoDescriptor.writable ).toBeTruthy()
        expect( !protoDescriptor.enumerable ).toBeTruthy()
        expect( !protoDescriptor.configurable ).toBeTruthy()

        checkDescriptors( Duck )
        checkDescriptors( Duck.prototype )

        const duck = new Duck
        duck.test()
    }

    // ##################################################
    // Show how to change class creation configuration, for example suppose we want
    // static and prototype props/methods to be enumerable, and the prototype to be
    // writable.
    {
        const Class = createClassHelper({
            prototypeWritable: true,
            defaultClassDescriptor: {
                enumerable: true,
                configurable: false,
            },
        })

        const AwesomeThing = Class(({Protected, Private}) => ({
            constructor() {},
            add() {},
            get foo() {},

            protected: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            private: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            static: {
                foo: 'foo',
                add() {},
                set foo(v) {},
            },

            test() {
                checkDescriptors( Protected(this).__proto__, true, false )
                checkDescriptors( Private(this).__proto__, true, false )
            },
        }))

        const protoDescriptor = Object.getOwnPropertyDescriptor( AwesomeThing, 'prototype' )
        expect( protoDescriptor.writable ).toBeTruthy()
        expect( !protoDescriptor.enumerable ).toBeTruthy()
        expect( !protoDescriptor.configurable ).toBeTruthy()

        checkDescriptors( AwesomeThing, true, false )
        checkDescriptors( AwesomeThing.prototype, true, false )

        const thing = new AwesomeThing
        thing.test()
    }

    // ##################################################
    // Show how to disable setting of descriptors, leaving them like ES5 classes
    // (gives better performance while defining classes too, if you don't need the
    // stricter descriptors)
    {
        const Class = createClassHelper({
            setClassDescriptors: false,
        })

        const PeanutBrittle = Class(({Protected, Private}) => ({
            constructor() {},
            add() {},
            get foo() {},

            protected: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            private: {
                foo: 'foo',
                add() {},
                get foo() {},
            },

            static: {
                foo: 'foo',
                add() {},
                set foo(v) {},
            },

            test() {
                checkDescriptors( Protected(this).__proto__, true, true )
                checkDescriptors( Private(this).__proto__, true, true )
            },
        }))

        const protoDescriptor = Object.getOwnPropertyDescriptor( PeanutBrittle, 'prototype' )
        expect( protoDescriptor.writable ).toBeTruthy()
        expect( !protoDescriptor.enumerable ).toBeTruthy()
        expect( !protoDescriptor.configurable ).toBeTruthy()

        checkDescriptors( PeanutBrittle, true, true )
        checkDescriptors( PeanutBrittle.prototype, true, true )

        const thing = new PeanutBrittle
        thing.test()
    }

    function checkDescriptors( obj, enumerable = false, configurable = true ) {
        const useBlacklist = typeof obj === 'function'

        const descriptors = Object.getOwnPropertyDescriptors( obj )
        let descriptor

        expect( Object.keys( descriptors ).length ).toBeTruthy()

        for ( const key in descriptors ) {
            if ( useBlacklist && staticBlacklist.includes( key ) ) continue

            descriptor = descriptors[ key ]

            if ( 'writable' in descriptor )
                expect( descriptor.writable ).toBeTruthy()
            else
                expect( 'get' in descriptor ).toBeTruthy()

            expect( descriptor.enumerable === enumerable ).toBeTruthy()
            expect( descriptor.configurable === configurable ).toBeTruthy()
        }
    }

    // ##################################################
    // Show use of nativeNaming (default is false)
    {
        // without native naming
        {
            const Class = createClassHelper({
                nativeNaming: false, // default
            })

            // anonymous:
            const Something = Class()
            expect( Something.name === '' ).toBeTruthy()

            // named:
            const OtherThing = Class('OtherThing')
            expect( OtherThing.name === 'OtherThing' ).toBeTruthy()

            expect( ! OtherThing.toString().includes('OtherThing') ).toBeTruthy()

            // make sure works with non-simple classes (because different code
            // path)
            const AwesomeThing = Class({ method() {} })
            expect( AwesomeThing.name ).toBe('')
            const AwesomeThing2 = Class('AwesomeThing2', { method() {} })
            expect( AwesomeThing2.name ).toBe('AwesomeThing2')
            expect( ! AwesomeThing2.toString().includes('AwesomeThing2') ).toBeTruthy()
        }

        // with native naming
        {
            // this config causes functions to be created using naming that is
            // native to the engine, by doing something like this:
            // new Function(` return function ${ className }() { ... } `)
            const Class = createClassHelper({
                nativeNaming: true,
            })

            // anonymous:
            const AnotherThing = Class()
            expect( AnotherThing.name === '' ).toBeTruthy()

            // named:
            const YetAnotherThing = Class('YetAnotherThing')
            expect( YetAnotherThing.name === 'YetAnotherThing' ).toBeTruthy()

            // here's the difference
            expect( YetAnotherThing.toString().includes('YetAnotherThing') ).toBeTruthy()

            // make sure works with non-simple classes (because different code
            // path)
            // make sure works with non-simple classes (because different code
            // path)
            const AwesomeThing = Class({ method() {} })
            expect( AwesomeThing.name ).toBe('')
            const AwesomeThing2 = Class('AwesomeThing2', { method() {} })
            expect( AwesomeThing2.name ).toBe('AwesomeThing2')
            expect( AwesomeThing2.toString().includes('AwesomeThing2') ).toBeTruthy()
        }
    }

    // ##################################################
    // test invalid Super access.
    {

        const verifyDimensionCall = jest.fn()

        // PhysicalObject implicitly extends from Object. ;)
        const PhysicalObject = Class({
            getDimensions() {

                // see below
                expect( this ).toBeInstanceOf( Piano )

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

                }).toThrow(InvalidSuperAccessError)

                // wish I had a super piano.

                let sound

                expect(() => {

                    sound = Super(this).makeSound()

                }).not.toThrow()

                // Oboes are already super though. :)

                return sound
            },

        }))

        const oboe = new Oboe()

        oboe.testFromInstrumentClass()
        expect( verifyDimensionCall ).toHaveBeenCalled()

        expect( oboe.testFromOboeClass() ).toBe( 'wooo' )
    }
})

