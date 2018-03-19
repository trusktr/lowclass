const Class = require('./src/index')
const InvalidAccessError = Class.InvalidAccessError

const Animal = Class('Animal', (public, protected, private) => ({

    // anything outside the public/protected/private definitions is
    // automatically public.
    constructor: function(name) {
        this.blah = "blah"
        protected(this).anything = 1234
        private(this).name = name
        console.log('Animal.constructor, PUBLIC instance', this)
        console.log('Animal.constructor, PROTECTED instance', protected(this), /*from Dog*/protected(this).sound)
        console.log('Animal.constructor, PRIVATE instance', private(this))
    },

    public: {
        talk: function talk() {
            protected(this).lorem = 'lorem'
            private(this).saySecret()
            protected(this).animalMethod()
            console.log('Animal.talk, PUBLIC instance', this)
            console.log('Animal.talk, PROTECTED instance', protected(this))
            console.log('Animal.talk, PRIVATE instance', private(this))
        },
    },

    protected: {
        sound: "aruuugah",
        animalMethod: function() {
            this.dude = "dude"
            console.log('Animal._animalMethod, PUBLIC instance', protected(this))
            console.log('Animal._animalMethod, PROTECTED instance', this)
            console.log('Animal._animalMethod, PRIVATE instance', private(this))
        },
    },

    private: {
        foo: "foo",
        saySecret: function() {
            console.log('raaaaaawr, I am ' + this.name)
            console.log('Animal.__saySecret, PUBLIC instance', private(this))
            console.log('Animal.__saySecret, PROTECTED instance', protected(this))
            console.log('Animal.__saySecret, PRIVATE instance', this)
        },
    },
}))

const Dog = Animal.subclass(function Dog(public, protected, private) {

    public.constructor = function(name) {
        Animal.call(this, name+'!')
        private(this).trained = true
        protected(this).foo()
        console.log('Dog.constructor, PUBLIC instance', this)
        console.log('Dog.constructor, PROTECTED instance', protected(this))
        console.log('Dog.constructor, PRIVATE instance', private(this))
    }

    public.talk = function() {
        Animal.prototype.talk.call(this)
        console.log('Dog.talk, PUBLIC instance', this)
        console.log('Dog.talk, PROTECTED instance', protected(this))
        console.log('Dog.talk, PRIVATE instance', private(this))
    }

    protected.sound = "Woof!"
    protected.foo = function() {
        if (protected(this).trained) console.log(private(this).lorem + "!")
        private(this).downwardDog()
        console.log('Dog._foo, PUBLIC instance', protected(this))
        console.log('Dog._foo, PROTECTED instance', this)
        console.log('Dog._foo, PRIVATE instance', private(this))
    }

    private.lorem = "lorem"

    return {
        private: {
            downwardDog: function() {
                console.log('Dog.__downwardDog, PUBLIC instance', private(this))
                console.log('Dog.__downwardDog, PROTECTED instance', protected(this))
                console.log('Dog.__downwardDog, PRIVATE instance', this)
            }
        }
    }
})

const animal = new Dog('Ranchuu')
animal.talk()

// we should not be able to access protected members from an unrelated class
try {
    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        private.ipsum = 'ipsum'
        public.testInvalidAccess = function() {
            let d = new Dog('Doggie')
            console.log('Try to access PROTECTED member from unrelated class:', protected(d).sound)
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

// we should not be able to access private members from an unrelated class
try {
    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        private.ipsum = 'ipsum'
        public.testInvalidAccess = function() {
            let d = new Dog('Doggie')
            console.log('Try to access PRIVATE member from unrelated class:', private(d).lorem)
        }
    })

    let u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, there was an error on invalid PRIVATE access')
    else throw e
}

// we can access a protected member from a related class (f.e. a super class)
try {
    let Dog

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            talk: function talk() {
                const dog = new Dog
                console.log('Access Dog\'s PROTECTED member from Animal class:', protected(dog).sound)
            },
        },
    }))

    Dog = Animal.subclass(function Dog(public, protected, private) {
        protected.sound = "Woof!"
    })

    const animal = new Animal('Ranchuu')
    animal.talk()

    console.log('SUCCESS, we were able to access Dog\'s PROTECTED member.')
}
catch (e) {
    console.log('ERROR, there shouldn\'t have been a problem accessing PROTECTED stuff from Dog')
    throw e
}

// we should not be able to access a private member from a related class (f.e. a super class)
try {
    //let Dog
    let itWorks = true

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            foo: function talk() {
                const dog = new Dog

                // in this case, the result will always be undefined, and the
                // only way we can test that this works is to make sure that
                // the value we're testing is truthy.
                console.log('Try to access Dog\'s PRIVATE member from Animal:', itWorks = !private(dog).sound)
                if (!itWorks) return

                private(dog).bar = 'NOT BAR'
                dog.foo()
                if (!itWorks) return

                itWorks = private(this).bar == 'BAR'
                if (!itWorks) return
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        protected.sound = "Woof!"
        public.foo = function() {

            itWorks = !private(this).bar
            if (!itWorks) return

            itWorks = !this.bar
            if (!itWorks) return
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()


    if (itWorks) console.log('SUCCESS (no error), we were not able to access Dog\'s PRIVATE member, although it created a new useless object.')
    else {
        throw new Error('ERROR, there should have been a problem accessing PRIVATE stuff from Dog')
    }
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS (via actual error), we were not able to access Dog\'s PRIVATE member.')
    else throw e
}

// private members can be accessed from the class where they are defined
try {

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.talk = function() {
            console.log(private(this).sound)
        }
    })

    const dog = new Dog()
    dog.talk()
}
catch (e) {
    throw e
}

console.log(' All tests passed! ')
