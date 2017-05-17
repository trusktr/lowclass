
lowclass
========

JavaScript class inheritance implementation with. protected and private members.

Usage
-----

In the following example, `_` is used in public and private methods to access
protected members, and `__` is used in public and protected methods to access
private members. Using `_` in a protected method returns gives you access to
public members, and using `__` in privat methods gives you access to public
members.

```js
const Class = require('./src/index')

const Animal = Class('Animal', (p, _, __) => ({

    // anything outside the public/protected/private definitions is
    // automatically public.
    constructor: function(name) {
        this.blah = "blah"
        _(this).anything = 1234
        __(this).name = name
    },

    public: {
        talk: function talk() {
            _(this).lorem = 'lorem'
            __(this).saySecret()
            _(this).animalMethod()
        },
    },

    protected: {
        sound: "aruuugah",
        animalMethod: function() {
            this.dude = "dude"
        },
    },

    private: {
        foo: "foo",
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
    }

    pub.talk = function() {
        Animal.prototype.talk.call(this)
    }

    prot.sound = "Woof!"
    prot.foo = function() {
        if (prot(this).trained) console.log(priv(this).lorem + "!")
        priv(this).downwardDog()
    }

    priv.lorem = "lorem"
})

const dog = new Dog('Ranchuu')
dog.talk()
```

More details coming later...

TODO
----

- [ ] Make the public parameter a public getter for use in protected/private
  methods, which will be more intuitive.
