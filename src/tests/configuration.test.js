import {Class, createClassHelper, staticBlacklist} from '../index.js'

const test = it

describe('configuration', () => {
	test('ensure that class prototype and static descriptors are like ES6 classes', () => {
		const Duck = Class(({Protected, Private}) => ({
			constructor() {},
			add() {},
			get foo() {},

			protected: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			private: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			static: {
				foo: 'foo',
				add() {},
				set foo(v) {},
			},

			test() {
				checkDescriptors(Protected(this).__proto__)
				checkDescriptors(Private(this).__proto__)
			},
		}))

		const protoDescriptor = Object.getOwnPropertyDescriptor(Duck, 'prototype')
		expect(!protoDescriptor.writable).toBeTruthy()
		expect(!protoDescriptor.enumerable).toBeTruthy()
		expect(!protoDescriptor.configurable).toBeTruthy()

		checkDescriptors(Duck)
		checkDescriptors(Duck.prototype)

		const duck = new Duck()
		duck.test()
	})

	test('Show how to change class creation configuration', () => {
		// for example suppose we want static and prototype props/methods to be
		// enumerable, and the prototype to be writable.

		const Class = createClassHelper({
			prototypeWritable: true,
			defaultClassDescriptor: {
				enumerable: true,
				configurable: false,
			},
		})

		const AwesomeThing = Class(({Protected, Private}) => ({
			constructor() {},
			add() {},
			get foo() {},

			protected: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			private: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			static: {
				foo: 'foo',
				add() {},
				set foo(v) {},
			},

			test() {
				checkDescriptors(Protected(this).__proto__, true, false)
				checkDescriptors(Private(this).__proto__, true, false)
			},
		}))

		const protoDescriptor = Object.getOwnPropertyDescriptor(AwesomeThing, 'prototype')
		expect(protoDescriptor.writable).toBeTruthy()
		expect(!protoDescriptor.enumerable).toBeTruthy()
		expect(!protoDescriptor.configurable).toBeTruthy()

		checkDescriptors(AwesomeThing, true, false)
		checkDescriptors(AwesomeThing.prototype, true, false)

		const thing = new AwesomeThing()
		thing.test()
	})

	test('Show how to disable setting of descriptors', () => {
		// leaving them like ES5 classes (gives better performance while defining
		// classes too, if you don't need the stricter descriptors)

		const Class = createClassHelper({
			setClassDescriptors: false,
		})

		const PeanutBrittle = Class(({Protected, Private}) => ({
			constructor() {},
			add() {},
			get foo() {},

			protected: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			private: {
				foo: 'foo',
				add() {},
				get foo() {},
			},

			static: {
				foo: 'foo',
				add() {},
				set foo(v) {},
			},

			test() {
				checkDescriptors(Protected(this).__proto__, true, true)
				checkDescriptors(Private(this).__proto__, true, true)
			},
		}))

		const protoDescriptor = Object.getOwnPropertyDescriptor(PeanutBrittle, 'prototype')
		expect(protoDescriptor.writable).toBeTruthy()
		expect(!protoDescriptor.enumerable).toBeTruthy()
		expect(!protoDescriptor.configurable).toBeTruthy()

		checkDescriptors(PeanutBrittle, true, true)
		checkDescriptors(PeanutBrittle.prototype, true, true)

		const thing = new PeanutBrittle()
		thing.test()
	})

	function checkDescriptors(obj, enumerable = false, configurable = true) {
		const useBlacklist = typeof obj === 'function'

		const descriptors = Object.getOwnPropertyDescriptors(obj)
		let descriptor

		expect(Object.keys(descriptors).length).toBeTruthy()

		for (const key in descriptors) {
			if (useBlacklist && staticBlacklist.includes(key)) continue

			descriptor = descriptors[key]

			if ('writable' in descriptor) expect(descriptor.writable).toBeTruthy()
			else expect('get' in descriptor).toBeTruthy()

			expect(descriptor.enumerable === enumerable).toBeTruthy()
			expect(descriptor.configurable === configurable).toBeTruthy()
		}
	}

	test('name classes natively (default is false)', () => {
		// without native naming
		{
			const Class = createClassHelper({
				nativeNaming: false, // default
			})

			// anonymous:
			const Something = Class()
			expect(Something.name === '').toBeTruthy()

			// named:
			const OtherThing = Class('OtherThing')
			expect(OtherThing.name === 'OtherThing').toBeTruthy()

			expect(!OtherThing.toString().includes('OtherThing')).toBeTruthy()

			// make sure works with non-simple classes (because different code path)
			const AwesomeThing = Class({method() {}})
			expect(AwesomeThing.name).toBe('')
			const AwesomeThing2 = Class('AwesomeThing2', {method() {}})
			expect(AwesomeThing2.name).toBe('AwesomeThing2')
			expect(!AwesomeThing2.toString().includes('AwesomeThing2')).toBeTruthy()
		}

		// with native naming
		{
			// this config causes functions to be created using naming that is
			// native to the engine, by doing something like this:
			// new Function(` return function ${ className }() { ... } `)
			const Class = createClassHelper({
				nativeNaming: true,
			})

			// anonymous:
			const AnotherThing = Class()
			expect(AnotherThing.name === '').toBeTruthy()

			// named:
			const YetAnotherThing = Class('YetAnotherThing')
			expect(YetAnotherThing.name === 'YetAnotherThing').toBeTruthy()

			// here's the difference
			expect(YetAnotherThing.toString().includes('YetAnotherThing')).toBeTruthy()

			// make sure works with non-simple classes (because different code path)
			const AwesomeThing = Class({method() {}})
			expect(AwesomeThing.name).toBe('')
			const AwesomeThing2 = Class('AwesomeThing2', {method() {}})
			expect(AwesomeThing2.name).toBe('AwesomeThing2')
			expect(AwesomeThing2.toString().includes('AwesomeThing2')).toBeTruthy()
		}
	})
})
