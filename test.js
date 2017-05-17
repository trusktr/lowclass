const Class = require('./src/index')

const Animal = Class('Animal', (p, _, __) => ({

    // anything outside the public/protected/private definitions is
    // automatically public.
    constructor: function(name) {
        this.blah = "blah"
        _(this).anything = 1234
        __(this).name = name
        console.log('Animal.constructor, PUBLIC instance', this)
        console.log('Animal.constructor, PROTECTED instance', _(this), /*from Dog*/_(this).sound)
        console.log('Animal.constructor, PRIVATE instance', __(this))
    },

    public: {
        talk: function talk() {
            _(this).lorem = 'lorem'
            __(this).saySecret()
            _(this).animalMethod()
            console.log('Animal.talk, PUBLIC instance', this)
            console.log('Animal.talk, PROTECTED instance', _(this))
            console.log('Animal.talk, PRIVATE instance', __(this))
        },
    },

    protected: {
        sound: "aruuugah",
        animalMethod: function() {
            this.dude = "dude"
            console.log('Animal._animalMethod, PUBLIC instance', _(this))
            console.log('Animal._animalMethod, PROTECTED instance', this)
            console.log('Animal._animalMethod, PRIVATE instance', __(this))
        },
    },

    private: {
        foo: "foo",
        saySecret: function() {
            console.log('raaaaaawr, I am ' + this.name)
            console.log('Animal.__saySecret, PUBLIC instance', __(this))
            console.log('Animal.__saySecret, PROTECTED instance', _(this))
            console.log('Animal.__saySecret, PRIVATE instance', this)
        },
    },
}))

const Dog = Animal.subclass(function Dog(pub, prot, priv) {

    pub.constructor = function(name) {
        Animal.call(this, name+'!')
        priv(this).trained = true
        prot(this).foo()
        console.log('Dog.constructor, PUBLIC instance', this)
        console.log('Dog.constructor, PROTECTED instance', prot(this))
        console.log('Dog.constructor, PRIVATE instance', priv(this))
    }

    pub.talk = function() {
        Animal.prototype.talk.call(this)
        console.log('Dog.talk, PUBLIC instance', this)
        console.log('Dog.talk, PROTECTED instance', prot(this))
        console.log('Dog.talk, PRIVATE instance', priv(this))
    }

    prot.sound = "Woof!"
    prot.foo = function() {
        if (prot(this).trained) console.log(priv(this).lorem + "!")
        priv(this).downwardDog()
        console.log('Dog._foo, PUBLIC instance', prot(this))
        console.log('Dog._foo, PROTECTED instance', this)
        console.log('Dog._foo, PRIVATE instance', priv(this))
    }

    priv.lorem = "lorem"

    return {
        private: {
            downwardDog: function() {
                console.log('Dog.__downwardDog, PUBLIC instance', priv(this))
                console.log('Dog.__downwardDog, PROTECTED instance', prot(this))
                console.log('Dog.__downwardDog, PRIVATE instance', this)
            }
        }
    }
})

const animal = new Dog('Ranchuu')
animal.talk()

try {
    const UnrelatedClass = Class(function UnrelatedClass(p, _, __) {
        __.ipsum = 'ipsum'
        p.someMethod = function() {
            let d = new Dog('Doggie')
            console.log('Access PROTECTED stuff:', _(d).sound)
        }
    })

    let u = new UnrelatedClass
    u.someMethod()
}
catch (e) {
    console.log('Success, there was an error on invalid PROTECTED access')
}

try {
    const UnrelatedClass = Class(function UnrelatedClass(p, _, __) {
        __.ipsum = 'ipsum'
        p.someMethod = function() {
            let d = new Dog('Doggie')
            console.log('Access PRIVATE stuff:', __(d).lorem)
        }
    })

    let u = new UnrelatedClass
    u.someMethod()
}
catch (e) {
    console.log('Success, there was an error on invalid PRIVATE access')
}

try {
    let Dog

    const Animal = Class('Animal', (p, _, __) => ({
        public: {
            foo: function talk() {
                const dog = new Dog
                console.log('Access Dog\'s PROTECTED from Animal:', _(dog).sound)
            },
        },
    }))

    Dog = Animal.subclass(function Dog(_public, _protected, _private) {
        _protected.sound = "Woof!"
    })

    const animal = new Animal('Ranchuu')
    animal.foo()

    console.log('Success, we were able to access Dog\'s PROTECTED member.')
}
catch (e) {
    console.log('Uh oh, there shouldn\'t have been problem accessing PROTECTED stuff from Dog')
}

try {
    let Dog
    let itWorks = true

    const Animal = Class('Animal', (p, _, __) => ({
        public: {
            foo: function talk() {
                const dog = new Dog
                console.log('Access Dog\'s PRIVATE from Animal:', itWorks = !__(dog).sound)
                if (!itWorks) return

                __(dog).bar = 'NOT BAR'
                dog.foo()
                if (!itWorks) return

                itWorks = __(this).bar == 'BAR'
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    Dog = Animal.subclass(function Dog(_public, _protected, _private) {
        _protected.sound = "Woof!"
        _public.foo = function() {
            itWorks = !__(this).bar
        }
    })

    const animal = new Animal('Ranchuu')
    animal.foo()


    if (itWorks) console.log('Success (no error), we were not able to access Dog\'s PRIVATE member, although it created a new useless object.')
    else console.log('Uh oh, there should have been a problem accessing PRIVATE stuff from Dog')
}
catch (e) {
    console.log('Success (actual error), we were not able to access Dog\'s PRIVATE member.')
}
