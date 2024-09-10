# lowclass

JavaScript/TypeScript class inheritance tools.

Lowclass is a lib that includes the following inheritance tools:

- A `multiple()` function for composing ES2015 `class`es together in a simple
  ergonomic way. For example:

  ```js
  import {multiple} from 'lowclass/dist/multiple.js'

  // define a few classes with unique features:
  class Walker {
  	walk() {
  		/* feet move */
  	}
  }
  class Talker {
  	talk() {
  		/* hello */
  	}
  }
  class Barker {
  	bark() {
  		/* woof */
  	}
  }
  class Attacker {
  	attack() {
  		/* boom */
  	}
  }

  // Now use them like regular classes by extending from them normally:

  class StarWarsATATWalker extends Walker {
  	fireLaser() {
  		/* ... */
  	}
  }

  const atat = new StarWarsATATWalker()
  atat.walk()
  atat.fireLaser()

  // Or compose them together:

  class Dog extends multiple(Walker, Barker, Attacker) {
  	lick() {
  		/* ... */
  	}
  }

  const dog = new Dog()
  dog.lick()
  dog.walk()
  dog.bark()
  dog.attack()

  class Human extends multiple(Talker, Attacker, Walker) {
  	yell() {
  		/* Hey! */
  	}
  }

  const person = new Human()
  person.yell()
  person.walk()
  person.talk()
  person.attack()
  ```

- A `Mixin()` helper for making mixable ES2015 `class`es. Mixins are less
  ergonomic than composing classes with the `multiple()` helper, but if you're
  after performance, then mixins (made with or without the `Mixin()` helper) will have
  faster instantiation and property lookup than classes composed with
  `multiple()`. For example:

  ```js
  import {Mixin} from 'lowclass/dist/Mixin.js'

  // define a few "class-factory mixins":
  const Walker = Mixin(Base => {
  	return class Walker extends Base {
  		walk() {
  			/* feet move */
  		}
  	}
  })
  const Talker = Mixin(Base => {
  	return class Talker extends Base {
  		talk() {
  			/* hello */
  		}
  	}
  })
  const Barker = Mixin(Base => {
  	return class extends Base {
  		bark() {
  			/* woof */
  		}
  	}
  })
  const Attacker = Mixin(Base => {
  	return class extends Base {
  		attack() {
  			/* boom */
  		}
  	}
  })

  // At this point Walker, Talker, and Barker are references to ES2015 `class`es.

  // Now use them like regular classes by extending from them normally:

  class StarWarsATATWalker extends Walker {
  	fireLaser() {
  		/* ... */
  	}
  }

  const atat = new StarWarsATATWalker()
  atat.walk()
  atat.fireLaser()

  // Or mix them together to compose features together:

  class Dog extends Walker.mixin(Barker.mixin(Attacker)) {
  	lick() {
  		/* ... */
  	}
  }

  const dog = new Dog()
  dog.lick()
  dog.walk()
  dog.bark()
  dog.attack()

  class Human extends Talker.mixin(Attacker.mixin(Walker)) {
  	yell() {
  		/* Hey! */
  	}
  }

  const person = new Human()
  person.yell()
  person.walk()
  person.talk()
  person.attack()
  ```

- A `Class()` tool for creating classes with public, protected, and private members. For example:

  ```js
  import Class from 'lowclass/dist/Class.js'
  import Something from 'somewhere'

  export default Class('Thing').extends(Something, ({Protected, Private}) => ({
      doSomething() {
          // this method is public
          Protected(this).makeStuff()
      }

      protected: {
          makeStuff() {
              // this method is protected
              Private(this).stuffImpl()
          }
      },

      private: {
          stuffImpl() {
              // this method is private
          }
      }
  }))
  ```

  ```js
  import Thing from './Thing'

  const Blob = Class('Blob').extends(Thing, ({Super, Protected, Private}) => ({
  	doSomething() {
  		Super(this).doSomething() // works fine, makeStuff is public.
  		Protected(this).makeStuff() // works fine, makeStuff is protected and inherited

  		// logs "undefined", private methods are not inherited
  		console.log(this.stuffImpl)

  		// try to access it with the Private helper:
  		Private(this).stuffImpl() // error, can not read property "stuffImpl" of undefined.
  	},
  }))

  const blob = new Blob()
  // access public members:
  blob.doSomething() // it works

  // can not acecss protected or private members:
  blob.makeStuff() // error, can not read property "makeStuff" of undefined.
  blob.stuffImpl() // error, can not read property "stuffImpl" of undefined.
  ```

#### `npm install lowclass --save`

Lowclass let's us define classes with protected and private data similar to in
C++ (and similar to some some extent Java):

- `Public` members can be accessed from outside the class.
- `Protected` members can be accessed in the class and its derived classes.
- `Private` members can be only accessed within the class.

But there's an interesting difference (advantage) that lowclass private members
have over C++ private members: private functionality of a class made with
lowclass can be inherited by a derived subclass, but the functionality is still
scoped to the class where it is utilized, meaning that the inherited
functionality will operate on the private data of the class where the inherited
functionality is used without breaking private, protected, and public API
contracts.

Lowclass supports

- extending builtins like Array. (see
  [`tests/extending-builtins.test.js`](./tests/extending-builtins.test.js)).
- extending native ES6 classes. (see
  [`tests/extending-native-classes.test.js`](./tests/extending-native-classes.test.js))
- extending builtins like `HTMLElement` and using the subclasses in native APIs
  like Custom Elements. (see
  [`tests/custom-elements.test.js`](./tests/custom-elements.test.js)).

## Intro

All of the intro examples are available as tests in
[`tests/readme-examples.test.js`](./tests/readme-examples.test.js), and
the other test files contain many more examples.

### Hiding members of your existing classes

You may already be using ES2015's native `class` syntax to define your classes,
for example:

```js
class Thing {
	constructor() {
		// you might be using a convention like leading underscores to
		// tell people some property is "protected" or "private"
		this._protectedProperty = 'yoohoo'
	}

	someMethod() {
		return this._protectedProperty
	}
}

const instance = new Thing()

instance.someMethod() // returns "yoohoo"

// but the property is not actually protected:
console.log(instance._protectedProperty) // "yoohoo"
```

The good news is, you can use lowclass to add Protected and Private
functionality to your existing classes!

Just wrap your class with Class to gain Protected or Private functionality:

```js
import {Class} from 'lowclass/dist/Class.js'

const Thing = Class(({Protected}) => {
	return class Thing {
		constructor() {
			// make the property truly protected
			Protected(this).protectedProperty = 'yoohoo'
		}

		someMethod() {
			console.log('Protected value is:', Protected(this).protectedProperty)
		}
	}
})
```

We can make it a little cleaner:

```js
const Thing = Class(
	({Protected}) =>
		class {
			constructor() {
				Protected(this).protectedProperty = 'yoohoo'
			}

			someMethod() {
				return Protected(this).protectedProperty
			}
		},
)
```

If we were exporting this from a module, we could write it like this:

```js
export default Class(
	({Protected}) =>
		class Thing {
			constructor() {
				Protected(this).protectedProperty = 'yoohoo'
			}

			someMethod() {
				return Protected(this).protectedProperty
			}
		},
)
```

You might still be making ES5-style classes using `function() {}` instead of
`class`. In this case wrapping it would look like this:

```js
const Thing = Class(({Protected}) => {
	function Thing() {
		Protected(this).protectedProperty = 'yoohoo'
	}

	Thing.prototype = {
		constructor: Thing,

		someMethod() {
			return Protected(this).protectedProperty
		},
	}

	return Thing
})
```

And it works:

```js
const t = new Thing()

expect(t.someMethod()).toBe('yoohoo')

// the value is not publicly accessible!
expect(t.protectedProperty).toBe(undefined)
```

But this is a fairly simple example. Let's show how inheritance of protected
members works, again wrapping a native ES6+ `class`. Suppose we have a derived
class that is also using the not-actually-protected underscore convention:

```js
class Something extends Thing {
	otherMethod() {
		// we'll need to update this
		return this._protectedProperty
	}
}
```

We will wrap it with lowclass too, so that it can inherit the protected member:

```js
const Something = Class(
	({Protected}) =>
		class extends Thing {
			otherMethod() {
				// access the inherited actually-protected member
				return Protected(this).protectedProperty
			}
		},
)
```

If you are writing ES5-style classes, it will look something like this:

```js
const Something = Class(({Protected}) => {
	function Something() {
		Thing.call(this)
	}

	Something.prototype = {
		__proto__: Thing.prototype,
		constructor: Something,

		otherMethod() {
			// access the inherited actually-protected member
			return Protected(this).protectedProperty
		},
	}

	return Something
})
```

And it works:

```js
const s = new Something()
expect(s.protectedProperty).toBe(undefined)
expect(s.otherMethod()).toBe('yoohoo')
```

Nice, we can keep internal implementation hidden, and prevent people from using
our APIs in unexpected ways!

### Private members

Continuing from above, if we use a Private member instead of a Protected member
in a derived subclass, the subclass will not be able to access the private
member of the parent class (like C++ and Java).

Here's an example that shows the concept, but this time we will define the
classes directly with lowclass, instead of wrapping a class:

```js
import {Class} from 'lowclass/dist/Class.js'

const Thing = Class(({Private}) => ({
	constructor() {
		Private(this).privateProperty = 'yoohoo'
	},
}))

const Something = Thing.subclass(({Private}) => ({
	otherMethod() {
		return Private(this).privateProperty
	},
}))

const something = new Something()

// the private member can't be accessed by the subclass code:
expect(something.otherMethod()).toBe(undefined)
```

As you can see, code in the child class (`otherMethod`) is unable to access the
private value of the parent class.

### Private Inheritance

In the last example, We've learned that, like in C++ or Java, subclasses can
not access parent class private members.

But lowclass offers something that C++ and Java do not: Private Inheritance.
Subclasses can inherit (make use of) private functionality from a parent class.
A subclass can call an inherited private method, but the interesting thing is
that the inherited private method _will operate on the private data of the
subclass, not of the parent class_.

Let's illustrate this with an example, then we'll explain afterwords how it
works:

```js
import {Class} from 'lowclass/dist/Class.js'

const Thing = Class(({Private}) => ({
	constructor() {
		Private(this).privateProperty = 'yoohoo'
	},

	someMethod() {
		return Private(this).privateProperty
	},

	changeIt() {
		Private(this).privateProperty = 'oh yeah'
	},
}))

const Something = Class().extends(Thing, ({Private}) => ({
	otherMethod() {
		return Private(this).privateProperty
	},

	makeItSo() {
		Private(this).privateProperty = 'it is so'
	},
}))

const instance = new Something()

expect(instance.someMethod()).toBe('yoohoo')
expect(instance.otherMethod()).toBe(undefined)

instance.changeIt()
expect(instance.someMethod()).toBe('oh yeah')
expect(instance.otherMethod()).toBe(undefined)

instance.makeItSo()
expect(instance.someMethod()).toBe('oh yeah')
expect(instance.otherMethod()).toBe('it is so')
```

> Huh? What?

In every class hierarchy, there is a private scope for each class in the
hierarchy (just like in C++ and Java). In this case, there's two private
scopes: one for `Thing`, and one for `Something`. `Thing.someMethod` and
`Thing.changeIt` are accessing the `privateProperty` of `Thing`, while
`Something.otherMethod` and `Something.makeItSo` are accessing the
`privateProperty` of `Something`.

But unlike C++ and Java, lowclass has a concept of private inheritance, where a
subclass can re-use private logic of a parent class, but the logic will operate
on private members of the class scope where it is used.

To use inheritable functionality, all that you have to do is run private code
in the code of a subclass. Let's make one more example to show what this means
in another way:

```js
const Counter = Class(({Private}) => ({
	private: {
		// this is a prototype property, the initial private value will be
		// inherited by subclasses
		count: 0,

		increment() {
			this.count++
		},
	},

	tick() {
		Private(this).increment()

		return Private(this).count
	},

	getCountValue() {
		return Private(this).count
	},
}))

const DoubleCounter = Counter.subclass(({Private}) => ({
	doubleTick() {
		// to use inherited private functionality in a subclass, simply use
		// the functionality in the code of the subclass.
		Private(this).increment()
		Private(this).increment()

		return Private(this).count
	},

	getDoubleCountValue() {
		return Private(this).count
	},
}))

const counter = new Counter()

expect(counter.tick()).toBe(1)

const doubleCounter = new DoubleCounter()

expect(doubleCounter.doubleTick()).toBe(2)
expect(doubleCounter.tick()).toBe(1)

expect(doubleCounter.doubleTick()).toBe(4)
expect(doubleCounter.tick()).toBe(2)

// There's a private `counter` member for the Counter class, and there's a
// separate private `counter` member for the `DoubleCounter` class (the
// initial value inherited from `Counter`):
expect(doubleCounter.getDoubleCountValue()).not.toBe(counter.getCountValue())
expect(doubleCounter.getCountValue()).toBe(2)
expect(doubleCounter.getDoubleCountValue()).toBe(4)
```

The inherited private functionality has to be triggered directly, as triggering
it indirectly will make it behave like in C++ and Java. This is why when we
called `doubleCounter.tick()` the private functionality operated on the private
`count` property of the `Counter` class, not the `DoubleCounter` class.

The key thing to learn from this is that when private code is used, it operates
on the class scope where the code is triggered. In the case of `DoubleCounter`,
we trigger the inherited functionality inside of the `DoubleCounter.doubleTick`
method, so this makes the inherited functionality operate on `DoubleCounter`'s
inherited private `count` property.

### "friends" like in C++, or "package protected" like in Java

Lowclass makes it possible to do something similar to "friend" in C++ or
"package protected" in Java. We can do these sorts of things by "leaking" the
access helpers to a scope that is outside a class definition.

For example, in the following example, the `Counter` class has private data,
and the `Incrementor` class can access the protected member of the `Counter`
class although `Incrementor` is not derived from `Counter`. These two classes
are exported and then imported by another file which can not access the private
data, but can use the public API of both classes to make instances of the two
classes interact with eachother.

```js
// Counter.js

// show how to do something similar to "friend" in C++ or "package protected"
// in Java.

import {Class} from 'lowclass/dist/Class.js'

let CounterProtected

const Counter = Class(({Private, Protected}) => {
	// leak the Counter class Protected helper to outer scope
	CounterProtected = Protected

	return {
		value() {
			return Private(this).count
		},

		private: {
			count: 0,
		},

		protected: {
			increment() {
				Private(this).count++
			},
		},
	}
})

// note how Incrementor does not extend from Counter
const Incrementor = Class(({Private}) => ({
	constructor(counter) {
		Private(this).counter = counter
	},

	increment() {
		const counter = Private(this).counter
		CounterProtected(counter).increment()
	},
}))

export {Counter, Incrementor}
```

```js
// shows that functionality similar to "friend" in C++ or "package
// protected" can be done with lowclass. See `./Counter.js` to learn how it
// works.

import {Counter, Incrementor} from './Counter'

// in a real-world scenario, counter might be used here locally...
const counter = new Counter()

// ...while incrementor might be passed to third party code.
const incrementor = new Incrementor(counter)

// show that we can only access what is public
expect(counter.count).toBe(undefined)
expect(counter.increment).toBe(undefined)
expect(typeof counter.value).toBe('function')

expect(incrementor.counter).toBe(undefined)
expect(typeof incrementor.increment).toBe('function')

// show that it works:
expect(counter.value()).toBe(0)
incrementor.increment()
expect(counter.value()).toBe(1)
incrementor.increment()
expect(counter.value()).toBe(2)
```

## Forms of writing classes

Working examples of the various forms depicted here are in
[`tests/syntaxes.test.js`](./tests/syntaxes.test.js).

### Simple object literals

If we will only use public members in our class, we can define a class with a
simple object literal in a few ways.

Here's a named class, and in this case it is a little redundant as there are
two occurrences of "Thing" in the definition:

```js
const Thing = Class( 'Thing', {
    method() { ... }
})
```

An anonymous class can avoid redundancy, and new engines are good at showing
you variable names in the console when classes or functions are anonymous:

```js
const Thing = Class({
    method() { ... }
})
```

A named class can be useful for debugging in older environments, and when used
with with direct exports as there's no redundancy:

```js
export default Class( 'Thing', {
    method() { ... }
})
```

If you're not using Protected or Private members, you probably don't need to
even use lowclass, and native `class` syntax can give you all the Public
functionality that you need.

### Definer functions give us access to access helpers.

There's also a [proposal for private
members](https://github.com/tc39/proposal-class-fields) in the works, but who
knows how long until it makes its way into engines, if ever.

Until then, we can use a "definer function" when defining a class with
lowclass, so that we can access Public, Protected, Private, and Super helpers.

Instead of providing a simple object literal as above, we can provide a
function that receives access helpers. This function should then return the
object literal that contains the definition of the class, or should return a
custom-made class constructor.

#### Returning an object literal

```js
export default Class('Thing', function (Public, Protected, Private, Super) {
	return {
		method() {
			// use any of the helpers inside the class code, as needed, f.e.

			// access Public members
			this.foo = 'foo'

			// access Protected members
			Protected(this).bar = 'bar'

			// access Private members
			Private(this).baz = 'baz'
		},
	}
})
```

To make code shorter, you can combine arrow functions with destructuring of
arguments. In this exampe, we only need the Private helper:

```js
export default Class('Thing', ({Private}) => ({
	method() {
		// access Private members
		Private(this).baz = 'baz'
	},
}))
```

#### Returning a class constructor

If you want to make your classes in your own way, you can return a class from a
definer function, which is useful for wrapping existing classes in order to
give them protected and private functionality:

```js
export default Class(({Private}) => {
	return class {
		method() {
			Private(this).baz = 'baz'
		}
	}
})

// or

export default Class(
	({Private}) =>
		class {
			method() {
				Private(this).baz = 'baz'
			}
		},
)
```

### ES5-like assignment to prototype

You might have lots of ES5-style code, so this form can be useful in porting
over to lowclass more quickly, or maybe you just like this form more.

```js
export default Class('Thing', ({Public, Private}) => {
	Public.prototype.method = function () {
		Private(this).baz = 'baz'
	}
})
```

### Subclasses

We can make a subclass in a couple ways, with ot without names, and using
object literals or definer functions. We'll use the `Super` helper to access
super methods.

#### With `.extends`

This way is more similar to native classes:

```js
const Something = Class().extends(Thing, ({Super}) => ({
	method() {
		Super(this).method()
	},
}))
```

And as before, naming the class can be useful:

```js
export default Class('Something').extends(Thing, ({Private}) => ({
	method() {
		Super(this).method()
	},
}))
```

#### With `.subclass`

Here's same subclass example using `.subclass`:

```js
const Something = Thing.subclass(({Super}) => ({
	method() {
		Super(this).method()
	},
}))
```

And as before, naming the class can be useful:

```js
export default Thing.subclass('Something', ({Super}) => ({
	method() {
		Super(this).method()
	},
}))
```

We can also stick lowclass onto any constructor, and use it just like the
previous example:

```js
import {Class} from 'lowclass/dist/Class.js'

Array.subclass = Class

const MyArray = Array.subclass( ({ Super, Private }) => {
    constructor() {
        const self = super.constructor(...args)
        self.__proto__ = MyArray.prototype

        Private(self).message = 'I am Array!'

        return self
    },
})
```

See the full Array example in
[`test/extending-builtins.test.js`](./test/extending-builtins.test.js).

## Differences between lowclass and other languages

### C++

C++ and lowclass are basically the same (including "friend" classes). Where
they differ is that lowclass offers "Private Inheritance" as described above
while C++ does not.

See [here](https://www.geeksforgeeks.org/access-modifiers-in-c/) for an
explainer on C++ access modifers which is effectively the same for lowclass.

### Java

The differences between lowclass' and Java's access modifiers are basically the
same as the differences between C++ and Java. Lowclass additionally has
"Private Inheritance". Lowclass also has a concept similar to "package
protected" which is similar to "friend" in C++.

See [here](https://www.javatpoint.com/access-modifiers) for an explainer of
Java access modifiers. We can compare this against C++, and therefore also
against lowclass.

## TODO

- [ ] public/protected/private/super helpers for static members
- [ ] ability to make classes "final"
