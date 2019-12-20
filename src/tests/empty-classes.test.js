import Class from '../index'

const test = it

describe('empty classes', () => {
	test('anonymous empty base classes', () => {
		const Constructor = Class()
		const instance = new Constructor()
		expect(instance instanceof Constructor).toBeTruthy()
		expect(Constructor.name === '').toBeTruthy()
		expect(Constructor.prototype.__proto__ === Object.prototype).toBeTruthy()
	})

	test('named empty base class', () => {
		const Foo = Class('Foo')
		const foo = new Foo()
		expect(foo instanceof Foo).toBeTruthy()
		expect(Foo.name === 'Foo').toBeTruthy()
		expect(Foo.prototype.__proto__ === Object.prototype).toBeTruthy()
	})

	test('anonymous non-empty base class', () => {
		const Dog = Class(() => ({
			method() {},
		}))

		expect(Dog.name === '').toBeTruthy()
		expect(Dog.prototype.__proto__ === Object.prototype).toBeTruthy()

		const dog = new Dog()
		expect(dog instanceof Dog).toBeTruthy()
		expect(typeof dog.method === 'function').toBeTruthy()
	})

	test('named non-empty base class', () => {
		const Dog = Class('Dog', () => ({
			method() {},
		}))

		expect(Dog.name === 'Dog').toBeTruthy()
		expect(Dog.prototype.__proto__ === Object.prototype).toBeTruthy()

		const dog = new Dog()
		expect(dog instanceof Dog).toBeTruthy()
		expect(typeof dog.method === 'function').toBeTruthy()
	})

	test('anonymous empty subclass', () => {
		const LivingThing = Class()
		const Alien = Class().extends(LivingThing)
		expect(Alien.name === '').toBeTruthy()
		expect(Alien.prototype.__proto__ === LivingThing.prototype).toBeTruthy()

		const a = new Alien()
		expect(a instanceof Alien).toBeTruthy()
	})

	test('named empty subclass', () => {
		const LivingThing = Class('LivingThing')
		const Alien = Class('Alien').extends(LivingThing)
		expect(Alien.name === 'Alien').toBeTruthy()
		expect(Alien.prototype.__proto__ === LivingThing.prototype).toBeTruthy()

		const a = new Alien()
		expect(a instanceof Alien).toBeTruthy()
	})

	test('anonymous non-empty subclass', () => {
		const LivingThing = Class(() => ({
			method1() {},
		}))
		const Alien = Class().extends(LivingThing, () => ({
			method2() {},
		}))
		expect(Alien.name === '').toBeTruthy()
		expect(Alien.prototype.__proto__ === LivingThing.prototype).toBeTruthy()

		const a = new Alien()
		expect(a instanceof Alien).toBeTruthy()
		expect(a.method1).toBeTruthy()
		expect(a.method2).toBeTruthy()
	})

	test('named non-empty subclass', () => {
		const LivingThing = Class('LivingThing', () => ({
			method1() {},
		}))
		const Alien = Class('Alien').extends(LivingThing, () => ({
			method2() {},
		}))
		expect(Alien.name === 'Alien').toBeTruthy()
		expect(Alien.prototype.__proto__ === LivingThing.prototype).toBeTruthy()

		const a = new Alien()
		expect(a instanceof Alien).toBeTruthy()
		expect(typeof a.method1 === 'function').toBeTruthy()
		expect(typeof a.method2 === 'function').toBeTruthy()
	})

	test('anonymous subclass with extends at the end', () => {
		const SeaCreature = Class(() => ({
			method1() {},
		}))

		const Shark = Class(() => ({
			method2() {},
		})).extends(SeaCreature)

		expect(Shark.name === '').toBeTruthy()
		expect(Shark.prototype.__proto__ === SeaCreature.prototype).toBeTruthy()

		const shark = new Shark()
		expect(shark instanceof Shark).toBeTruthy()
		expect(typeof shark.method1 === 'function').toBeTruthy()
		expect(typeof shark.method2 === 'function').toBeTruthy()
	})

	test('named subclass with extends at the end', () => {
		const SeaCreature = Class(() => ({
			method1() {},
		}))

		const Shark = Class('Shark', () => ({
			method2() {},
		})).extends(SeaCreature)

		expect(Shark.name === 'Shark').toBeTruthy()
		expect(Shark.prototype.__proto__ === SeaCreature.prototype).toBeTruthy()

		const shark = new Shark()
		expect(shark instanceof Shark).toBeTruthy()
		expect(typeof shark.method1 === 'function').toBeTruthy()
		expect(typeof shark.method2 === 'function').toBeTruthy()
	})
})
