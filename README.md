
lowclass
========

A low-complexity JavaScript class inheritance implementation with protected, public, and private members.

Usage
-----

(See many more examples in the [test file](./test.js))

```js
const Class = require('./src/index')

const Animal = Class('Animal', (Public, Protected, Private) => ({

    // anything outside the public/protected/private definitions is
    // automatically public. Note, constructors can only be public at the moment,
    // but I'm thinking about how to allow constructors to be "private" or "protected".
    constructor: function(name) {
        this.blah = "blah" // public `blah` property
        Protected(this).anything = 1234
        Private(this).name = name
    },

    public: {
        talk: function talk() {
            Protected(this).lorem = 'lorem'
            Private(this).saySecret()
            Protected(this).animalMethod()
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
arguments: the Public helper, the Protected helper, and the Private helper.

Extend a class with the `.subclass` static method, into which you also pass a
definer function that receives the three same type of args. You can also assign
properties onto the `prototype` properties of the three args to define
properties and methods, not just return an object definition like in the Animal
class.

```js
const Dog = Animal.subclass(function Dog(Public, Protected, Private) {

    Public.prototype.constructor = function(name) {
        Animal.call(this, name+'!')
        Private(this).trained = true
        Protected(this).foo()

        this.saySecret() // error, because there is no public saySecret method
        Private(this).saySecret() // error, because saySecret is private in the above Animal class, not in the Dog class
    }

    Public.prototype.talk = function() {
        Animal.prototype.talk.call(this)

        Protected(this).animalMethod() // it works, protected methods are available in all sub classes.
    }

    Protected.prototype.sound = "Woof!"
    Protected.prototype.foo = function() {
        if (Private(this).trained) console.log(Private(this).lorem + "!")
        Private(this).downwardDog()
    }

    Private.prototype.lorem = "lorem"
    Private.prototype.downwardDog = function() {
        console.log('did downwardDog')
    }
})

const dog = new Dog('Ranchuu')
dog.talk() // works, talk() is public
dog.downwardDog() // error, no public downwardDog method
dog.animalMethod() // error, no public animalMethod method
```

It is possible to purposefully leak the Public/Protected/Private helpers outside
of the class definition, which recommend that you avoid. For example:

```js
let Protected = null

const Dog = Animal.subclass(function Dog(Public, _Protected, Private) {
    Protected = _Protected

    // ... same definition as the previous class ...
})

const dog = new Dog('Ranchuu')

Protected(dog).animalMethod() // works, because we leaked the Protected helper outside of the class definition.
```

There might be valid use cases for leaking the access helpers, but in general
the goal of using this lib is to expose only the public API of your class to
the consumer, otherwise you may as well just use native JavaScript `class`
syntax where everything is just public.
