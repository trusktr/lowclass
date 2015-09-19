
lowclass
========

Low-complexity class inheritance.

Usage
-----

### Creating base classes

Call `Class()` with two arguments: the first the name of your class, and the
second an object literal (the "class body") containing the properties and
methods of your new class.

**In ES6:**

```js
var HairyCreature = Class('HairyCreature', {
    HairyCreature() { // constructor
        // this.super is Object for base classes.
        this.super.apply(this, arguments)

        this.furColor = 'white'
    },

    makeSound() {
        console.log('ooooooowwhaaaa!')
    },
})

var something = new HairyCreature
something.makeSound()
```

**In ES5:**

```js
var HairyCreature = Class('HairyCreature', {
    HairyCreature: function HairyCreature() { // constructor
        // this.super is Object for base classes.
        this.super.apply(this, arguments)

        this.furColor = 'white'
    },

    makeSound: function makeSound() {
        console.log('ooooooowwhaaaa!')
    },
})

var something = new HairyCreature
something.makeSound()
```

### Extending classes

To extend a class, call `Class()` with a single argument -- the name of your
new class -- then chain a call to `.extends()` with two arguments -- the class
your are extending and the body of your new class.

**In ES6:**

```js
var Dog = Class('Dog').extends(HairyCreature, {
    Dog() { // constructor
        this.super.apply(this, arguments)
        this.barkSound = 'woof!'
        this.furColor = 'brown'
    },

    makeSound() {
        console.log(this.barkSound)
    },
})
```

**In ES5:**

```js
var Dog = Class('Dog').extends(HairyCreature, {
    Dog: function: Dog() { // constructor
        this.super.apply(this, arguments)
        this.barkSound = 'woof!'
        this.furColor = 'brown'
    },

    makeSound: function: makeSound() {
        console.log(this.barkSound)
    },
})
```

> Note: When writing in ES5, naming your functions can be useful in stack traces
> and when logging instances to the console, but it requires extra typing. Inline
> functions in ES6 are named functions by default.

### Specifying a constructor

You can set a property method called "constructor" in your class body, or a
property method named the same as your class, in order to set your class'
constructor. F.e., the following two versions are valid:

```js
var Something = Class('Something', {
  Something: function() {...}
})

// or

var Something = Class('Something', {
  constructor: function Something() {...}
})
```

If you're using ES6 (f.e. via Babel), you can write either of the two:

```js
var Something = Class('Something', {
  Something() {...}
})

// or

var Something = Class('Something', {
  constructor() {...}
})
```

Note: In the second version (using `constructor() {...}`) the name of your
class instances will appear as `constructor` instead of `Something` in the
console, which may not be helpful. You might like to do it the first way,
matching your class name (f.e. `Something() {...}`)

If you provide both methods (one on the "constructor" property and the other
on a property with the same name as your class), as in

```js
var Something = Class('Something', {
  constructor() {...},
  Something() {...},
})
```

then the `constructor` method will take precendence, and the other method will
just be a regular method on the class.

You can omit the constructor in your class body. The following two examples are
(almost) equivalent, except the second example's constructor is generated
automatically.  The only difference is that the second example's constructor is
not a named function due to limitations in ES5, but this doesn't affect the
functionality of the program:

```js
var Something = Class('Something', {
    Something: function() {
        this.super.call(this)
    },
    saySomething: function saySomething() {
        console.log('something')
    },
})

// is functionally equivalent to

var Something = Class('Something', {
    saySomething: function saySomething() {
        console.log('something')
    },
})
```

### Accessing the super class

By default, a property called `super` will be set onto a new class' prototype
for convenience, as seen in the previous examples. Change the value of
`Class.superHelper` to `false` to disable the feature.

`this.super` can be convenient for accessing the super constructor, as well as
all the properties and methods of the super class. F.e., while
`Class.superHelper` is `true` (the default value), we can write the Dog's
`saySomething` method like so:

```js
    saySomething() {
        // call the same method of the super class.
        this.super.saySomething.call(this)

        console.log(this.barkSound)
    },
```

While `Class.superHelper` is `false`, we can write `saySomething` as:

```js
    saySomething() {
        // Using a direct reference to the HairyCreature class.
        HairyCreature.prototype.saySomething.call(this)

        console.log(this.barkSound)
    },
```

With `Class.superHelper` as `false`, the original Dog example could be written as:

```js
Class.superHelper = false

var Dog = Class('Dog').extends(HairyCreature, {
    Dog() {
        // Using the HairyCreature constructor directly now:
        HairyCreature.apply(this, arguments)

        this.barkSound = 'woof!'
        this.furColor = 'brown'
    },

    saySomething() {
        console.log(this.barkSound)
    },
})
```
