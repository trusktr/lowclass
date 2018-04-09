
lowclass
========

JavaScript class inheritance with public, protected, and private members.

Lowclass let's you define classes with protected and private data similar to
that of protected and private in C++:

- `Public` members can be accessed from outside the class.
- `Protected` members can be accessed in the class and its derived classes.
- `Private` members can be only accessed within the class.

But there's an interesting difference (advantage) lowclass private members have
over C++ private members: private functionality of a class made with lowclass
can be inherited by a derived class, but the functionality is still scoped to
the class where it is utilized, meaning that the inherited functionality will
operate on the private data of the class where the inherited functionality is
used without breaking protected and public API contracts.

Extending builtins like Array is supported
([example](./src/tests/extending-builtins.test.js)) by Lowclass. Extending
native ES6 classes and using the subclasses in native APIs like Custom Elements
is also supported ([example](./src/tests/custom-elements.test.js)).

Intro
-----

You may already be using the new native `class` syntax to define your classes, for example:

```js
class MyClass {

	constructor() {

		// you might be using some convention, like leading underscores, to
		// describe that a member should be considered "protected" or "private":
		this._protectedProperty = "yoohoo"

	}

	someMethod() {
		console.log('Protected value is:', this._protectedProperty)
	}

}

const instance = new MyClass

instance.someMethod() // logs "Protected value is: yoohoo"

// but the property is still publicly accessible:
console.log( instance._protectedProperty ) // "yoohoo"
```

You might even be still making ES5-style classes using `function() {}` instead of `class`.

The good news is, you can use lowclass to add Protected and Private
functionality to your existing classes! For example, here the previous example
with some small tweaks:

```js
import protect from 'lowclass'
// or const protect = require('lowclass')

// just wrap your class with lowclass, and gain Protected or Private
// functionality. Most of the time you probably want Protected functionality, so
// this example only uses Protected:

const MyClass = protect( ({ Protected }) => {

	return class MyClass {

		constructor() {
			// stop using underscore, make it truly protected:
			Protected(this).protectedProperty = "yoohoo"
		}

		someMethod() {
			console.log('Protected value is:', Protected(this).protectedProperty)
		}

	}

})

const instance = new MyClass

instance.someMethod() // logs "Protected value is: yoohoo"

// the value is not publicly accessible!
console.log( instance.protectedProperty ) // undefined
```

But this is a fairly simple example. Let's show how inheritance of protected
members works, again wrapping a native ES6+ `class`. Suppose we have a derived
class using the old underscore convention:

```js
class MyOtherClass extends MyClass {
	otherMethod() {

		// we'll need to update this, because MyClass.protectedProperty truly protected now:
		console.log( 'Inherited protected value: ', this._protectedProperty)

	}
}
```

We can wrap it with lowclass:

```js
const MyOtherClass = protect( ({ Protected }) => {

	return class MyOtherClass extends MyClass {
		otherMethod() {

			// access the truly protected member now:
			console.log( 'Inherited protected value: ', Protected(this).protectedProperty)

		}
	}

})

const instance = new MyOtherClass

console.log( instance.protectedProperty ) // undefined

instance.otherMethod() // logs "Inherited protected value: yoohoo"
```

Nice, we can keep internal implementation hidden, and prevent people from
breaking our APIs in unexpected ways!

Let's use a Private member instead of a Protected member to show that a derived
subclass is not able to access it:

```js
const protect = require('lowclass')

const MyClass = protect( ({ Private }) => {

	return class MyClass {

		constructor() {
			Private(this).privateProperty = "yoohoo"
		}

		someMethod() {
			console.log('Private value:', Private(this).privateProperty)
		}

		changeIt() {
			Private(this).privateProperty = 'oh yeah'
		}

	}

})

const MyOtherClass = protect( ({ Private }) => {

	return class MyOtherClass extends MyClass {

		otherMethod() {
			console.log( 'Private value: ', Private(this).privateProperty)
		}

		makeItSo() {
			Private(this).privateProperty = 'it is so'
		}

	}

})

const instance = new MyOtherClass

instance.someMethod() // logs "Private value: yoohoo"
instance.otherMethod() // logs "Private value: undefined"

instance.changeIt()
instance.someMethod() // logs "Private value: oh yeah"
instance.otherMethod() // logs "Private value: undefined"

instance.makeItSo()
instance.someMethod() // logs "Private value: oh yeah"
instance.otherMethod() // logs "Private value: it is so"
```

What happened there? In every class hierarchy, there is a private scope for
each class in the hierarchy. In this case, there's two private scopes: one for
MyClass, and one for MyOtherClass.

