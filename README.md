
lowclass
========

JavaScript class inheritance implementation with. protected and private members.

Usage
-----

```js
const Class = require('./src/index')

const Animal = Class('Animal', (public, protected, private) => ({

    // anything outside the public/protected/private definitions is
    // automatically public. Note, constructors can only be public at the moment,
    // but thinking about how to make them "private" or "protected".
    constructor: function(name) {
        this.blah = "blah" // public `blah` property
        protected(this).anything = 1234
        private(this).name = name
    },

    public: {
        talk: function talk() {
            protected(this).lorem = 'lorem'
            private(this).saySecret()
            protected(this).animalMethod()
        },
    },

    protected: {
        sound: "aruuugah",
        animalMethod: function() {
            this.dude = "dude"
        },
    },

    private: {
        saySecret: function() {
            console.log('raaaaaawr, I am ' + this.name)
        },
    },
}))
```

As you can see, the definer function passed into `Class()` receives three
arguments: the public prototype, the protected getter, and the private getter.

Extend a class with the `.subclass` static method, into which you also pass a
definer function that receives the three same type of args. You can also assign
properties onto the three args to define properties and methods, not just
returning an object definition like in the Animal class.

```js
const Dog = Animal.subclass(function Dog(pub, prot, priv) {

    pub.constructor = function(name) {
        Animal.call(this, name+'!')
        priv(this).trained = true
        prot(this).foo()

        this.saySecret() // error, because there is no public saySecret method
        priv(this).saySecret() // error, because saySecret is private in the above Animal class
    }

    pub.talk = function() {
        Animal.prototype.talk.call(this)

        prot(this).animalMethod() // it works, protected methos is available in all sub classes.
    }

    prot.sound = "Woof!"
    prot.foo = function() {
        if (priv(this).trained) console.log(priv(this).lorem + "!")
        priv(this).downwardDog()
    }

    priv.lorem = "lorem"
    priv.downwardDog = function() {
        console.log('did downwardDog')
    }
})

const dog = new Dog('Ranchuu')
dog.talk() // works, talk() is public
dog.downwardDog() // error, no public downwardDog method
dog.animalMethod() // error, no public animalMethod method
```

It is possible to purposefull leak the public/protected/private helpers outside
of the class definition, which recommend that you avoid. For example:

```js
let protected = null

const Dog = Animal.subclass(function Dog(pub, prot, priv) {
    protected = prot

    // ... same definition as the previous class ...
})

const dog = new Dog('Ranchuu')

protected(dog).animalMethod() // works, because we leaked the protected helper outside of the class definition.

// There might be valid use cases for this, but be careful if you want to
// uphold the contract of your class the consumer of the class.
```

More details coming later...
