import Class from '../index'

const test = it

describe('README examples', () => {
	test('use a real protected member instead of the underscore convention, ES2015 classes', () => {
		// an alias, which semantically more meaningful when wrapping a native
		// `class` that already contains the "class" keyword.
		const protect = Class

		const Thing = protect(
			({Protected}) =>
				class {
					constructor() {
						// stop using underscore and make it truly protected:
						Protected(this).protectedProperty = 'yoohoo'
					}

					someMethod() {
						return Protected(this).protectedProperty
					}
				},
		)

		const t = new Thing()

		expect(t.someMethod()).toBe('yoohoo')

		// the value is not publicly accessible!
		expect(t.protectedProperty).toBe(undefined)

		const Something = protect(
			({Protected}) =>
				class extends Thing {
					otherMethod() {
						// access the inherited actually-protected member
						return Protected(this).protectedProperty
					}
				},
		)

		const s = new Something()
		expect(s.protectedProperty).toBe(undefined)
		expect(s.otherMethod()).toBe('yoohoo')
	})

	test('use a real protected member instead of the underscore convention, ES5 classes', () => {
		// an alias, which semantically more meaningful when wrapping a native
		// `class` that already contains the "class" keyword.
		const protect = Class

		const Thing = protect(({Protected}) => {
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

		const t = new Thing()

		expect(t.someMethod()).toBe('yoohoo')

		// the value is not publicly accessible!
		expect(t.protectedProperty).toBe(undefined)

		const Something = protect(({Protected}) => {
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

		const s = new Something()
		expect(s.protectedProperty).toBe(undefined)
		expect(s.otherMethod()).toBe('yoohoo')
	})

	test('no access of parent private data in subclass', () => {
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
	})

	test('no access of parent private data in subclass', () => {
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

		expect(something.otherMethod()).toBe(undefined)
	})

	test('private inheritance', () => {
		const Counter = Class(({Private}) => ({
			private: {
				// this is a prototype prop, the initial value will be inherited by subclasses
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
	})
})
