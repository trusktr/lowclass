import {Constructor} from './utils'

// --- TODO handle static inheritance. Nothing has been implemented with regards to
// static inheritance yet.

// --- TODO allow the subclass (f.e. the `Foo` in `class Foo extends multiple(One,
// Two, Three) {}`) to call each super constructor (One, Two, and Three)
// individually with specific arguments.

// --- TODO Prevent duplicate classes in the "prototype tree". F.e. if someone calls
// `multiple(One, Two, Three)`, and `Three` already includes `Two`, we can
// discard the `Two` argument and perform the combination as if `multiple(One,
// Three)` had been called.

// --- TODO cache the results, so more than one call to `multiple(One, Two, Three)`
// returns the same class reference as the first call.

// --- TODO, allow the user to handle the diamond problem in some way other than
// ("property or method from the first class in the list wins"). Perhaps require
// the user to specify which method to call. For now, it simply calls the first
// method in the order in which the classes were passed into multiple(). Look
// here for ideas based on how different languages handle it:
// https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem

/**
 * Mixes the given classes into a single class. This is useful for multiple
 * inheritance.
 *
 * @example
 * class Foo {}
 * class Bar {}
 * class Baz {}
 * class MyClass extends multiple(Foo, Bar, Baz) {}
 */
//  ------------ method 1, define the `multiple()` signature with overrides. The
//  upside is it is easy to understand, but the downside is that name collisions
//  in properties cause the collided property type to be `never`. This would make
//  it more difficult to provide solution for the diamond problem.
//  ----------------
// function multiple(): typeof Object
// function multiple<T extends Constructor>(classes: T): T
// function multiple<T extends Constructor[]>(...classes: T): Constructor<ConstructorUnionToInstanceTypeUnion<T[number]>>
// function multiple(...classes: any): any {
//
//  ------------ method 2, define the signature of `multiple()` with a single
//  signature. The upside is this picks the type of the first property
//  encountered when property names collide amongst all the classes passed into
//  `multiple()`, but the downside is the inner implementation may require
//  casting, and this approach can also cause an infinite type recursion
//  depending on the types used inside the implementation.
//  ----------------
export function multiple<T extends Constructor[]>(...classes: T): CombinedClasses<T> {
	// avoid performance costs in special cases
	if (classes.length === 0) return Object as any
	if (classes.length === 1) return classes[0] as any

	const FirstClass = classes.shift()!

	// inherit the first class normally. This allows for required native
	// inheritance in certain special cases (like inheriting from HTMLElement
	// when making Custom Elements).
	class MultiClass extends FirstClass {
		constructor(...args: any[]) {
			super(...args)

			// This is so that `super` calls will work. We need to do this
			// because MultiClass.prototype is non-configurable, so it is
			// impossible to wrap it with a Proxy. So instead, we do surgery on
			// the class that extends from MultiClass, and replace the prototype
			// with our own custom Proxy-wrapped prototype.
			const protoBeforeMultiClassProto = findPrototypeBeforeMultiClassPrototype(this, MultiClass.prototype)
			if (protoBeforeMultiClassProto && protoBeforeMultiClassProto !== newMultiClassPrototype) {
				Object.setPrototypeOf(protoBeforeMultiClassProto, newMultiClassPrototype)
			}

			const instances: Object[] = []

			// make instances of the other classes to get/set properties on.
			let Ctor: Constructor
			for (let i = 0, l = classes.length; i < l; i += 1) {
				Ctor = classes[i]
				const instance = Reflect.construct(Ctor, args)
				instances.push(instance)
			}

			return new Proxy(this, {
				// No `set()` trap is needed in this Proxy handler, at least for
				// the tests so far. Methods automatically have the correct
				// receiver when the are gotten with the `get()` trap, so if any
				// methods set a property, the set happens on the expected
				// instance, just like regular [[Set]].

				get(target, key: string | symbol, self: MultiClass): any {
					if (Reflect.ownKeys(target).includes(key)) return Reflect.get(target, key, self)

					let instance: Object

					for (let i = 0, l = instances.length; i < l; i += 1) {
						instance = instances[i]
						if (Reflect.ownKeys(instance).includes(key)) return Reflect.get(instance, key, self)
					}

					const proto = Object.getPrototypeOf(self)
					if (Reflect.has(proto, key)) return Reflect.get(proto, key, self)

					return undefined
				},

				ownKeys(target) {
					let keys = Reflect.ownKeys(target)

					let instance: Object
					let instanceKeys: (string | symbol | number)[]

					for (let i = 0, l = instances.length; i < l; i += 1) {
						instance = instances[i]
						instanceKeys = Reflect.ownKeys(instance)
						for (let j = 0, l = instanceKeys.length; j < l; j += 1) keys.push(instanceKeys[j])
					}

					return keys
				},

				// This makes the `in` operator work, for example.
				has(target, key: string | symbol): boolean {
					if (Reflect.ownKeys(target).includes(key)) return true

					let instance: Object
					for (let i = 0, l = instances.length; i < l; i += 1) {
						instance = instances[i]
						if (Reflect.ownKeys(instance).includes(key)) return true
					}

					// all instances share the same prototype, so just check it once
					const proto = Object.getPrototypeOf(self)
					if (Reflect.has(proto, key)) return true

					return false
				},
			})
		}
	}

	const newMultiClassPrototype = new Proxy(
		{
			// --- TODO is __proto__ instead of Object.assign/create faster?
			__proto__: MultiClass.prototype,

			// This is useful for debugging while looking around in devtools.
			__InjectedMultiClassPrototype__: MultiClass.name,
		},
		{
			get(target, key: string | symbol, self: MultiClass): any {
				if (Reflect.has(target, key)) return Reflect.get(target, key, self)

				let Class: Constructor
				for (let i = 0, l = classes.length; i < l; i += 1) {
					Class = classes[i]
					if (Reflect.has(Class.prototype, key)) return Reflect.get(Class.prototype, key, self)
				}
			},

			has(target, key): boolean {
				if (Reflect.has(target, key)) return true

				let Class: Constructor
				for (let i = 0, l = classes.length; i < l; i += 1) {
					Class = classes[i]
					if (Reflect.has(Class.prototype, key)) return true
				}

				return false
			},
		},
	)

	return (MultiClass as unknown) as CombinedClasses<T>
}

function findPrototypeBeforeMultiClassPrototype(obj: Object, multiClassPrototype: Object): Object | null {
	let previous = obj
	let current = Object.getPrototypeOf(obj)

	while (current) {
		if (current === multiClassPrototype) return previous
		previous = current
		current = Object.getPrototypeOf(current)
	}

	return null
}

// type ConstructorUnionToInstanceTypeUnion<U> = (U extends Constructor
//   ? (k: InstanceType<U>) => void
//   : never) extends (k: infer I) => void
//     ? I
//     : never

type Shift<T extends any[]> = ((...args: T) => any) extends (_: any, ...args: infer R) => any ? R : never
type MixedArray<T extends Constructor<any>[]> = _MixedArray<T, {}>
type _MixedArray<T extends Constructor<any>[], U> = {
	0: new () => U
	1: _MixedArray<
		Shift<T>,
		{
			[K in keyof InstanceType<T[0]> | keyof U]: K extends keyof U ? U[K] : InstanceType<T[0]>[K]
		}
	>
}[T['length'] extends 0 ? 0 : 1]

type CombinedClasses<T> = T extends [] | [undefined]
	? typeof Object
	: T extends Constructor[]
	? MixedArray<T>
	: typeof Object
