// various forms of writing classes ("syntaxes")

import Class from '../index'
import {native} from '../native'

const test = it

describe('various forms of writing classes', () => {
	test('object literal', () => {
		const Foo = Class({
			constructor() {
				this.bar = 'bar'
			},
			foo() {
				expect(this.bar === 'bar').toBeTruthy()
			},
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('definer function (arrow function), returning an object literal', () => {
		const Foo = Class(({Super}) => ({
			constructor() {
				this.bar = 'bar'
			},
			foo() {
				expect(Super(this).hasOwnProperty('bar')).toBe(true)
				expect(this.bar === 'bar').toBeTruthy()
			},
		}))

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('definer function (non-arrow), returning an object literal', () => {
		const Foo = Class(function ({Super}) {
			return {
				constructor() {
					this.bar = 'bar'
				},
				foo() {
					expect(Super(this).hasOwnProperty('bar')).toBe(true)
					expect(this.bar === 'bar').toBeTruthy()
				},
			}
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('definer function (arrow function), setting ES5-like prototype assignment', () => {
		const Foo = Class(({Super, Public}) => {
			Public.prototype.constructor = function () {
				this.bar = 'bar'
			}
			Public.prototype.foo = function () {
				expect(Super(this).hasOwnProperty('bar')).toBe(true)
				expect(this.bar === 'bar').toBeTruthy()
			}
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('wrap a native class', () => {
		const Foo = Class(
			() =>
				class {
					constructor() {
						this.bar = 'bar'
					}
					foo() {
						expect(this.bar === 'bar').toBeTruthy()
					}
				},
		)

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('wrap an ES5 class', () => {
		const Foo = Class(() => {
			function Foo() {
				this.bar = 'bar'
			}

			Foo.prototype = {
				constructor: Foo,
				foo() {
					expect(this.bar === 'bar').toBeTruthy()
				},
			}

			return Foo
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		f.foo()
	})

	test('object literal with access helpers on each access definition', () => {
		const Foo = Class({
			public: (Protected, Private) => ({
				constructor() {
					this.bar = 'bar'
				},
				foo() {
					expect(this.bar === 'bar').toBeTruthy()
					expect(Protected(this).foo() === 'barbar3').toBeTruthy()
					expect(Private(this).foo() === 'barbar2').toBeTruthy()
					return 'it works'
				},
			}),
			protected: (Public, Private) => ({
				bar: 'bar2',
				foo() {
					return Public(this).bar + Private(this).bar
				},
			}),
			private: (Public, Protected) => ({
				bar: 'bar3',
				foo() {
					return Public(this).bar + Protected(this).bar
				},
			}),
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		expect(f.foo() === 'it works').toBeTruthy()

		const Bar = Foo.subclass({
			public: Protected => ({
				test() {
					return Protected(this).test()
				},
			}),
			protected: ({Super, Public}) => ({
				test() {
					return Super(Public(this)).foo()
				},
			}),
		})

		const b = new Bar()
		expect(b instanceof Bar).toBeTruthy()
		expect(b.foo() === 'it works').toBeTruthy()
	})

	test('definer function and ES5-like prototype assignment', () => {
		const Foo = Class(({Protected, Private, Public}) => {
			Public.prototype.constructor = function () {
				this.bar = 'bar'
			}

			Public.prototype.foo = function () {
				expect(this.bar === 'bar').toBeTruthy()
				expect(Protected(this).foo() === 'barbar3').toBeTruthy()
				expect(Private(this).foo() === 'barbar2').toBeTruthy()
				return 'it works'
			}

			Protected.prototype.bar = 'bar2'

			Protected.prototype.foo = function () {
				return Public(this).bar + Private(this).bar
			}

			Private.prototype.bar = 'bar3'

			Private.prototype.foo = function () {
				return Public(this).bar + Protected(this).bar
			}
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		expect(f.foo() === 'it works').toBeTruthy()

		const Bar = Foo.subclass(({Public, Protected, Super}) => {
			Public.prototype.test = function () {
				return Protected(this).test()
			}

			Protected.prototype.test = function () {
				return Super(Public(this)).foo()
			}
		})

		const b = new Bar()
		expect(b instanceof Bar).toBeTruthy()
		expect(b.foo() === 'it works').toBeTruthy()
	})

	test('definer function and ES5-like prototype object literals', () => {
		const Foo = Class(({Protected, Private, Public}) => {
			Public.prototype = {
				constructor() {
					this.bar = 'bar'
				},

				foo() {
					expect(this.bar === 'bar').toBeTruthy()
					expect(Protected(this).foo() === 'barbar3').toBeTruthy()
					expect(Private(this).foo() === 'barbar2').toBeTruthy()
					return 'it works'
				},
			}

			Protected.prototype = {
				bar: 'bar2',

				foo() {
					return Public(this).bar + Private(this).bar
				},
			}

			Private.prototype = {
				bar: 'bar3',

				foo() {
					return Public(this).bar + Protected(this).bar
				},
			}
		})

		const f = new Foo()
		expect(f instanceof Foo).toBeTruthy()
		expect(f.foo() === 'it works').toBeTruthy()

		const Bar = Foo.subclass(({Public, Protected, Super}) => {
			Public.prototype = {
				test() {
					return Protected(this).test()
				},
			}

			Protected.prototype = {
				test() {
					return Super(Public(this)).foo()
				},
			}
		})

		const b = new Bar()
		expect(b instanceof Bar).toBeTruthy()
		expect(b.foo() === 'it works').toBeTruthy()
	})

	test('different ways to make a subclass', () => {
		let Foo = Class()

		let Bar = Class().extends(Foo, {
			method() {},
		})
		let bar = new Bar()

		expect(bar instanceof Foo).toBeTruthy()
		expect(bar instanceof Bar).toBeTruthy()
		expect(typeof bar.method).toBe('function')

		Bar = Class({
			method() {},
		}).extends(Foo)
		bar = new Bar()

		expect(bar instanceof Foo).toBeTruthy()
		expect(bar instanceof Bar).toBeTruthy()
		expect(typeof bar.method).toBe('function')

		Bar = Foo.subclass({
			method() {},
		})
		bar = new Bar()

		expect(bar instanceof Foo).toBeTruthy()
		expect(bar instanceof Bar).toBeTruthy()
		expect(typeof bar.method).toBe('function')

		// TODO these doesn't work yet, but they should so that it is easy to work with existing code bases {

		//Foo = class {}
		//Foo.subclass = Class
		//Bar = Foo.subclass({
		//method() {}
		//})
		//bar = new Bar

		//expect( bar instanceof Foo ).toBeTruthy()
		//expect( bar instanceof Bar ).toBeTruthy()
		//expect( typeof bar.method ).toBe( 'function' )

		//Foo = native( class {} )
		//Foo.subclass = Class
		//Bar = Foo.subclass({
		//method() {}
		//})
		//bar = new Bar

		//expect( bar instanceof Foo ).toBeTruthy()
		//expect( bar instanceof Bar ).toBeTruthy()
		//expect( typeof bar.method ).toBe( 'function' )

		//Foo = Class( () => class {} )
		//Foo.subclass = Class
		//Bar = Foo.subclass({
		//method() {}
		//})
		//bar = new Bar

		//expect( bar instanceof Foo ).toBeTruthy()
		//expect( bar instanceof Bar ).toBeTruthy()
		//expect( typeof bar.method ).toBe( 'function' )

		// }
	})
})
