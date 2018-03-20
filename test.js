const Class = require('./src/index')
const InvalidAccessError = Class.InvalidAccessError

const assert = console.assert.bind( console )

// ##################################################
// only public members can be read/written from outside code
try {

    const Dog = Class('Dog', (public, protected, private) => ({
        setFoo() {
            this.foo = 'woo hoo'
        },
        checkFoo() {
            console.assert( this.foo === 'weee' )
        },
        setBar() {
            protected(this).bar = 'yippee'
        },
        checkBar() {
            console.assert( protected(this).bar === 'yippee' )
        },
        setBaz() {
            private(this).baz = 'oh yeah'
        },
        checkBaz() {
            console.assert( private(this).baz === 'oh yeah' )
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
catch (e) {
    throw e
}

// ##################################################
// we should not be able to access protected members from an unrelated class
try {
    const Dog = Class('Dog', (public, protected, private) => {
        protected.sound = "Woof!"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('Try to access PROTECTED member from unrelated class:', protected(dog).sound)
        }
    })

    let u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, there was an error on invalid PROTECTED access')
    else throw e
}

// ##################################################
// we should not be able to access private members from an unrelated class
try {
    const Dog = Class('Dog', (public, protected, private) => {
        private.breed = "labrador"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('Try to access PRIVATE member from unrelated class:', private(dog).breed)
        }
    })

    const u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, there was an error on invalid PRIVATE access')
    else throw e
}

// ##################################################
// we can access a child class protected member from a super class
try {
    const Animal = Class('Animal', (public, protected, private) => ({
        getDogSound: function talk() {
            const dog = new Dog
            return protected(dog).sound
        },
    }))

    const Dog = Animal.subclass('Dog', (public, protected) => {
        protected.sound = "Woof!"
    })

    const animal = new Animal
    const dogSound = animal.getDogSound()

    console.assert( dogSound === 'Woof!' )
}
catch (e) {
    console.log('ERROR, there shouldn\'t have been a problem accessing PROTECTED stuff from Dog')
    throw e
}

// ##################################################
// we can access a super class protected member from a child class
try {
    const Animal = Class('Animal', (public, protected, private) => {
        protected.alive = true
    })

    const Dog = Animal.subclass('Dog', (public, protected) => ({
        isAlive() {
            return protected(this).alive
        }
    }))

    const dog = new Dog
    console.assert( dog.isAlive() === true )
}
catch (e) {
    console.log('ERROR, there shouldn\'t have been a problem accessing PROTECTED stuff from Dog')
    throw e
}

// ##################################################
// we can not access a child class' private member from a parent class
{

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            foo: function talk() {
                const dog = new Dog

                // like in C++, accessing the private variable of a child class does not work.
                console.assert( private(dog).sound === undefined )

                // like in C++, we can only access the private members associated with the class that we are currently in:
                console.assert( private(dog).bar === 'BAR' )

                private(dog).sound = 'Awoooo!'
                dog.verifySound()
                dog.changeSound()
                console.assert( private(dog).sound === 'Awoooo!' )
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.verifySound = function() {
            console.assert( private(this).sound === 'Woof!' )
        }
        public.changeSound = function() {
            private(this).sound = "grrr!"
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()
}

// ##################################################
// we can not access a parent class' private member from a child class
try {

    const Animal = Class('Animal', (public, protected, private) => ({
        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.foo = function() {

            // should not be able to access Animal's private bar property
            console.assert( private(this).bar === undefined )
            console.assert( this.bar === undefined )
        }
    })

    const dog = new Dog
    dog.foo()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, we were not able to access Animal\'s PRIVATE member.')
    else throw e
}

// ##################################################
// further example, private members are isolated to their classes
{

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            test: function() {
                const dog = new Dog
                dog.bar = 'bar'
                dog.setBar()
                console.assert( private(this).bar === 'oh yeah' )
                private(this).bar = 'mmm hmmm'
                dog.checkBar()
                console.assert( private(this).bar === 'mmm hmmm' )
            },
        },

        private: {
            bar: 'oh yeah',
        },
    }))

    const Dog = Animal.subclass('Dog', (public, protected, private) => ({
        setBar: function() {
            private(this).bar = 'yippee'
        },
        checkBar: function() {
            console.assert( private(this).bar === 'yippee' )
            private(this).bar = 'woohoo'
        },
    }))

    const animal = new Animal
    animal.foo = 'foo'
    animal.test()
}

// ##################################################
// private members can be accessed only from the class where they are defined
try {

    const Dog = Class(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.talk = function() {
            console.assert( private(this).sound === "Woof!" )
        }
    })

    const dog = new Dog()

    // set public `sound` property
    dog.sound = 'awooo!'
    console.assert( dog.sound === 'awooo!' )

    dog.talk()

}
catch (e) {
    throw e
}

const publicAccesses = []
const protectedAccesses = []
const privateAccesses = []

const SomeClass = Class('SomeClass', (public, protected, private) => {

    return {
        foo: 'foo',

        publicMethod: function() {
            assert( this === public(this) )
            assert( this.foo === public(this).foo )

            assert( this.foo === 'foo' )
            assert( public(this).foo === 'foo' )
            assert( protected(this).bar === 'bar' )
            assert( private(this).baz === 'baz' )

            assert( public(this) !== protected(this) )
            assert( public(this) !== private(this) )
            assert( protected(this) !== private(this) )

            publicAccesses.push( public(this) )
            protectedAccesses.push( protected(this) )
            privateAccesses.push( private(this) )

            protected(this).protectedMethod()
            private(this).privateMethod()
        },

        protected: {
            bar: 'bar',

            protectedMethod: function() {
                assert( this === protected(this) )
                assert( this.bar === protected(this).bar )

                assert( this.bar === 'bar' )
                assert( public(this).foo === 'foo' )
                assert( protected(this).bar === 'bar' )
                assert( private(this).baz === 'baz' )

                assert( protected(this) !== public(this) )
                assert( protected(this) !== private(this) )
                assert( public(this) !== private(this) )

                publicAccesses.push( public(this) )
                protectedAccesses.push( protected(this) )
                privateAccesses.push( private(this) )
            },
        },

        private: {
            baz: 'baz',

            privateMethod: function() {
                assert( this === private(this) )
                assert( this.baz === private(this).baz )

                assert( this.baz === 'baz' )
                assert( public(this).foo === 'foo' )
                assert( protected(this).bar === 'bar' )
                assert( private(this).baz === 'baz' )

                assert( private(this) !== public(this) )
                assert( private(this) !== protected(this) )
                assert( public(this) !== protected(this) )

                publicAccesses.push( public(this) )
                protectedAccesses.push( protected(this) )
                privateAccesses.push( private(this) )
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

    const SubClass = SomeClass.subclass((public, protected, private) => {
        return {
            //one: 'one',

            publicMethod() {
                SomeClass.prototype.publicMethod.call(this)
            },

            //methodOne() {
            //},

            //protected: {
                //two: 'two',

                //protectedMethod() {
                    //SomeClass.prototype.protectedMethod.call(this)
                //},

                //methodTwo() {
                //},
            //},

            //private: {
                //three: 'three',

                //privateMethod() {
                    //SomeClass.prototype.privateMethod.call(this)
                //},

                //methodThree() {
                //},
            //},
        }
    })

    const o = new SubClass
    o.publicMethod()

    assert( publicAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( protectedAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )
    assert( privateAccesses.every( ( instance, i, accesses ) => instance === accesses[0] ) )

    publicAccesses.length = 0
    protectedAccesses.length = 0
    privateAccesses.length = 0
}

// ##################################################
// alternate "syntaxes" TODO
//{
    //const SubClass = BaseClass.subclass({
        //foo() {},
        //protected: (public, private) => ({
            //bar() {
                //public(this).foo()
            //}
        //}),
        //private: (public, protected) => ({
            //bar() {
                //public(this).foo()
            //}
        //}),
    //})
//}

console.log('')
console.log(' All tests passed! ')
