import {Counter, Incrementor} from './Counter.js'
import {Counter2, Incrementor2} from './Counter2.js'

const test = it

describe('Friends', () => {
	test(`
        functionality similar to "friend" in C++ or "package protected" in Java,
        by means of intentionally leaked access helpers
    `, () => {
		// shows that functionality similar to "friend" in C++ or "package
		// protected" can be done with lowclass. See `./Counter.js` to learn how it
		// works.

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
	})

	test(`
        functionality similar to "friend" in C++ or "package protected" in Java,
        by means of intentionally shared class brands
    `, () => {
		// shows that functionality similar to "friend" in C++ or "package
		// protected" can be done with lowclass. See `./Counter2.js` to learn how it
		// works.

		// in a real-world scenario, counter might be used here locally...
		const counter = new Counter2()

		// ...while incrementor might be passed to third party code.
		const incrementor = new Incrementor2(counter)

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
	})
})
