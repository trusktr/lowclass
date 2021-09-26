import Class from '../index.js'

const test = it

describe('wrap existing classes', () => {
	test('protected and private members for custom-made ES5 classes', () => {
		const Foo = Class(({Protected, Private}) => {
			// make and return our own es5-style base class, with Protected and
			// Private helpers in scope.

			function Foo() {
				this.foo = 'foo'
			}

			Foo.prototype = {
				constructor: Foo,
				test() {
					expect(this.foo === 'foo').toBeTruthy()
					expect(Private(this).bar === 'bar').toBeTruthy()
					expect(Protected(this).baz === 'baz').toBeTruthy()
				},

				// define access just like with regular class definitions
				private: {
					bar: 'bar',
				},
				protected: {
					baz: 'baz',
				},
			}

			return Foo
		})

		const foo = new Foo()
		foo.test()

		const Bar = Class(({Super, Private}) => {
			// make and return our own es5-style subclass

			const prototype = {
				__proto__: Foo.prototype,

				constructor: function () {
					Super(this).constructor()
				},

				test() {
					super.test()
					expect(Private(this).who === 'you').toBeTruthy()
				},

				private: {
					who: 'you',
				},
			}

			prototype.constructor.prototype = prototype

			return prototype.constructor
		})

		const bar = new Bar()
		bar.test()
	})

	test('protected and private members for custom-made native ES6+ classes', () => {
		// wrap our own es6 native-style base class with access helpers in scope.
		const Lorem = Class(
			({Protected, Private}) =>
				class {
					constructor() {
						this.foo = 'foo'
					}

					test() {
						expect(this.foo === 'foo').toBeTruthy()
						expect(Private(this).bar === 'bar').toBeTruthy()
						expect(Protected(this).baz === 'baz').toBeTruthy()
					}

					get private() {
						return {
							bar: 'bar',
						}
					}

					get protected() {
						return {
							baz: 'baz',
						}
					}
				},
		)

		const lorem = new Lorem()
		lorem.test()

		// wrap our own es6 native-style subclass with the access helpers in scope
		const Ipsum = Class(({Private}) => {
			return class extends Lorem {
				test() {
					super.test()
					expect(Private(this).secret === 'he did it').toBeTruthy()
				}

				get private() {
					return {
						secret: 'he did it',
					}
				}
			}
		})

		const ip = new Ipsum()
		ip.test()
	})
})
