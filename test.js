const Class = require('./src/index')
const InvalidAccessError = Class.InvalidAccessError

const assert = console.assert.bind( console )

// ##################################################
// only public members can be read/written from outside code
{

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

// ##################################################
// we should not be able to access protected members from an unrelated class
try {
    const Dog = Class('Dog', (public, protected, private) => {
        protected.sound = "Woof!"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', protected(dog).sound)
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
    const Dog = Class('Dog', (public, protected, private) => {
        private.breed = "labrador"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('should fail:', private(dog).breed)
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

// ##################################################
// we can access a super class protected member from a child class
{
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

                private(dog).bar = 'of soap'
                dog.checkBar()

                private(this).bar = 'of soap'
                dog.checkBar()

                dog.exposePrivate()
                assert( private(dog) !== dogPrivate )
                assert( private(this) !== dogPrivate )
                assert( private(this) !== private(dog) )
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    let dogPrivate = null

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.verifySound = function() {
            console.assert( private(this).sound === 'Woof!' )
        }
        public.changeSound = function() {
            private(this).sound = "grrr!"
        }
        public.checkBar = function() {
            assert( private(this).bar === undefined )
        }
        public.exposePrivate = function() {
            dogPrivate = private(this)
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()
}

// ##################################################
// we can not access a parent class' private member from a child class
{

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
{

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

    const SubClass = SomeClass.subclass((public, protected, private, _super) => ({

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
    const SomeClass = Class((public, protected, private) => ({

        // default access is public, like C++ structs
        publicMethod() {
            console.log('base class publicMethod')
            protected(this).protectedMethod()
        },

        checkPrivateProp() {
            console.assert( private(this).lorem === 'foo' )
        },

        protected: {
            protectedMethod() {
                console.log('base class protectedMethod:', private(this).lorem)
                private(this).lorem = 'foo'
            },
        },

        private: {
            lorem: 'blah',
        },
    }))

    const SubClass = SomeClass.subclass((public, protected, private, _super) => ({

        publicMethod() {
            _super(this).publicMethod()
            console.log('extended a public method')
            private(this).lorem = 'baaaaz'
            this.checkPrivateProp()
        },

        checkPrivateProp() {
            _super(this).checkPrivateProp()
            console.assert( private(this).lorem === 'baaaaz' )
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

    const GrandChildClass = SubClass.subclass((public, protected, private, _super) => ({

        test() {
            private(this).begin()
        },

        reallyBegin() {
            protected(this).reallyReallyBegin()
        },

        protected: {
            reallyReallyBegin() {
                _super(public(this)).publicMethod()
            },
        },

        private: {
            begin() {
                public(this).reallyBegin()
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
    const A = Class((public, protected, private) => ({
        foo: function (n) { return n }
    }))

    const B = A.subclass((public, protected, private, _super) => ({
        foo: function (n) {
            if (n > 100) return -1;
            return _super(this).foo(n+1);
        }
    }))

    const C = B.subclass((public, protected, private, _super) => ({
        foo: function (n) {
            return _super(this).foo(n+2);
        }
    }))

    var c = new C();
    assert( c.foo(0) === 3 )
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
