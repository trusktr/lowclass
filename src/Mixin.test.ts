// TODO no @ts-ignore comments

import Mixin, {HasInstance, type MixinResult} from './Mixin.js'
import instanceOf from './instanceOf.js'
import {Constructor} from './utils.js'

// TODO move type def to @lume/cli, map @types/jest's `expect` type into the
// global env.
declare global {
	function expect(...args: any[]): any
}

describe('Mixin', () => {
	it('Mixin returns a Function', () => {
		// const Foo = Mixin(Base => class Foo extends Constructor(Base || Object) {})
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin)
		class Bar {}
		const Baz = Foo.mixin(Bar)
		const Lorem = Foo.mixin(Bar)

		expect(typeof Foo).toBe('function')
		expect(typeof Foo.mixin).toBe('function')
		expect(typeof Baz).toBe('function')
		expect(typeof Lorem).toBe('function')
	})

	it('Mixin applications are cached', () => {
		// const Foo = Mixin(Base => class Foo extends Constructor(Base || Object) {})
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin)
		class Bar {}
		const Baz = Foo.mixin(Bar)
		const Lorem = Foo.mixin(Bar)

		// caching of the same mixin application
		expect(Baz).toBe(Lorem)
	})

	it('instanceof works with multiple classes generated from the same Mixin', () => {
		// const Foo = Mixin(Base => class Foo extends Constructor(Base || Object) {})
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin)
		class Bar {}
		const Baz = Foo.mixin(Bar)
		const Lorem = Foo.mixin(Bar)

		const baz = new Baz()

		expect(baz instanceof Foo).toBe(true)
		expect(baz instanceof Bar).toBe(true)
		expect(baz instanceof Baz).toBe(true)
		expect(baz instanceof Lorem).toBe(true)

		expect(instanceOf(baz, Foo)).toBe(true)
		expect(instanceOf(baz, Bar)).toBe(true)
		expect(instanceOf(baz, Baz)).toBe(true)
		expect(instanceOf(baz, Lorem)).toBe(true)
	})

	it('HasInstance delegates to super Symbol.hasInstance method, so regular instanceof works', () => {
		// const Foo = Mixin(Base => class Foo extends Constructor(Base || Object) {})
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin)
		class Bar {}
		const Baz = Foo.mixin(Bar)

		expect({} instanceof Baz).toBe(false)

		class Thing extends Baz {}

		expect(new Thing() instanceof Thing).toBe(true)
	})

	it('When Symbol is supported, instanceof works', () => {
		// const Ipsum = Mixin(Base => class Ipsum extends Constructor(Base || Object) {})
		function IpsumMixin<T extends Constructor>(Base: T) {
			class Ipsum extends Constructor(Base) {}
			return Ipsum as MixinResult<typeof Node, T>
		}
		const Ipsum = Mixin(IpsumMixin)
		class Blah {}
		const One = Ipsum.mixin(Blah)

		const one = new One()

		expect(one instanceof One).toBe(true)

		// there's two versions of Ipsum in play, the original one, and the one
		// created when making `One`, but instanceof checks still work:
		expect(one instanceof Ipsum).toBe(true)
	})

	it('When Symbol is not supported, instanceof does not work', () => {
		function test() {
			// const Ipsum = Mixin(Base => class Ipsum extends Constructor(Base || Object) {})
			function IpsumMixin<T extends Constructor>(Base: T) {
				class Ipsum extends Constructor(Base) {}
				return Ipsum as MixinResult<typeof Node, T>
			}
			const Ipsum = Mixin(IpsumMixin)
			class Blah {}
			const One = Ipsum.mixin(Blah)

			const one = new One()

			expect(one instanceof One).toBe(true)

			// Without Symbol.hasInstance, the internal trick doesn't work, so
			// instanceof won't be useful like we'd like it to be:
			expect(one instanceof Ipsum).toBe(false)
		}

		const originalSymbol = Symbol

		// Sometimes Symbol() is polyfilled in a way that it generates a random
		// regular property key.
		Symbol = (() => Math.random()) as any

		test()

		// Sometimes Symbol is not defined in the environment.
		Symbol = void 0 as any

		test()

		Symbol = originalSymbol
	})

	it('if a class already has its own Symbol.hasInstance method, we do not override it', () => {
		function fn() {}

		let FooMixin = function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base || Object) {}
			Object.defineProperty(Foo, Symbol.hasInstance, {value: fn})
			return Foo as MixinResult<typeof Foo, T>
		}

		// @ts-ignore TS v4 introduced a type error
		FooMixin = HasInstance(FooMixin)

		const Foo = FooMixin(class {})

		expect(Foo[Symbol.hasInstance]).toBe(fn)

		let BarMixin = function BarMixin<T extends Constructor>(Base: T) {
			class Bar extends Constructor(Base || Object) {}
			return Bar as MixinResult<typeof Bar, T>
		}

		// @ts-ignore TS v4 introduced a type error
		BarMixin = HasInstance(BarMixin)

		const Bar = BarMixin(class {})

		expect(Bar[Symbol.hasInstance]).not.toBe(fn)
	})

	it('configuring a default base class', () => {
		// const Foo = Mixin(Base => class Foo extends Constructor(Base || Object) {}, Map)
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin, Map)
		const Bar = class Bar extends Foo {}
		const bar = new Bar()
		// @ts-ignore
		const Baz = class Baz extends Foo.mixin(WeakMap) {}
		const baz = new Baz()

		expect(bar instanceof Map).toBe(true)

		expect(baz instanceof Map).toBe(false)
		expect(baz instanceof WeakMap).toBe(true)
	})

	it('check there are no duplicate applications of a mixin in a class hierarchy', () => {
		function FooMixin<T extends Constructor>(Base: T) {
			class Foo extends Constructor(Base) {}
			return Foo as MixinResult<typeof Node, T>
		}
		const Foo = Mixin(FooMixin, Map)
		class Bar extends Foo {}

		// because Bar already has Foo
		expect(Foo.mixin(Bar)).toBe(Bar)
	})
})
