import Class from '../index'
import {native} from '../native'

describe('Custom Elements', () => {
	// example of extending HTMLElement for use with customElements.define
	// (Custom Elements)
	it('works with custom elements', () => {
		// full example, wraps builting HTMLElement class with the native helper
		{
			const MyEL = Class().extends(native(HTMLElement), ({Super}) => ({
				static: {
					observedAttributes: ['foo'],
				},

				connected: false,
				disconnected: true,

				constructor() {
					// return is needed for it to work
					return Super(this).constructor()

					// native super works too
					//return super.constructor()
				},

				connectedCallback() {
					this.connected = true
					this.disconnected = false
				},

				disconnectedCallback() {
					this.connected = false
					this.disconnected = true
				},

				attributeChangedCallback(attr, oldVal, newVal) {
					this[attr] = newVal
				},
			}))

			customElements.define('my-el', MyEL)

			const el = document.createElement('my-el')

			document.body.appendChild(el)
			expect(el.connected).toBe(true)
			expect(el.disconnected).toBe(false)

			el.setAttribute('foo', 'bar')
			expect(el.foo).toBe('bar')

			document.body.removeChild(el)
			expect(el.connected).toBe(false)
			expect(el.disconnected).toBe(true)
		}

		// other ways to do it too:

		// with Reflect.construct and builtin HTMLElement, no native helper.
		// The native helper uses Reflect.construct internally to achieve a
		// similar effect.
		{
			const MyEl = Class().extends(window.HTMLElement, ({Super}) => ({
				constructor() {
					// Reflect.construct is needed to be used manually if we
					// don't use the native helper
					return Reflect.construct(Super(this).constructor, [], this.constructor)

					// using native super would work here too
					//return Reflect.construct(super.constructor, [], this.constructor)

					// we could also construct HTMLElement directly
					//return Reflect.construct(HTMLElement, [], this.constructor)

					// don't use new.target, it doesn't work (for now at least)
					//return Reflect.construct(super.constructor, [], new.target)
				},
				connectedCallback() {
					this.connected = true
				},
			}))

			customElements.define('my-el1', MyEl)
			const el = new MyEl()
			document.body.appendChild(el)

			expect(el.connected).toBe(true)

			document.body.removeChild(el)
		}

		// extending a Custom Elements class.
		{
			const MyEl = Class().extends(native(HTMLElement), {
				constructor() {
					return super.constructor()
				},
				connectedCallback() {
					this.connected = true
				},
			})

			const MyEl2 = Class().extends(MyEl, {
				constructor() {
					return super.constructor()
				},
				connectedCallback() {
					super.connectedCallback()
				},
			})

			customElements.define('my-el2', MyEl2)
			const el = document.createElement('my-el2')

			expect(el instanceof MyEl2).toBe(true)

			document.body.appendChild(el)

			expect(el.connected).toBe(true)

			document.body.removeChild(el)
		}

		// When using `Reflect.construct`, use `this.constructor` in place of
		// `new.target`
		{
			const MyEl = Class().extends(native(HTMLElement), {
				constructor() {
					return Reflect.construct(super.constructor, [], this.constructor)
				},
				connectedCallback() {
					this.connected = true
				},
			})

			const MyEl2 = Class().extends(MyEl, {
				constructor() {
					return Reflect.construct(super.constructor, [], this.constructor)
				},
				connectedCallback() {
					super.connectedCallback()
				},
			})

			customElements.define('my-el3', MyEl2)
			const el = document.createElement('my-el3')

			expect(el instanceof MyEl2).toBe(true)

			document.body.appendChild(el)

			expect(el.connected).toBe(true)

			document.body.removeChild(el)
		}

		// if you provide your own classes, you can do it any way you want,
		// including using Reflect.construct with new.target
		{
			const MyEl = Class(
				({Protected}) =>
					class extends HTMLElement {
						constructor() {
							return Reflect.construct(HTMLElement, [], new.target)
						}
						connectedCallback() {
							Protected(this).connected = true
						}

						getProtectedMember() {
							return Protected(this).connected
						}

						// define initial protected values
						static protected() {
							return {
								connected: false,
							}
						}
					},
			)

			const MyEl2 = Class(
				({Protected}) =>
					class extends MyEl {
						constructor() {
							return Reflect.construct(MyEl, [], new.target)
						}

						connectedCallback() {
							super.connectedCallback()
						}
					},
			)

			customElements.define('my-el6', MyEl2)
			const el = document.createElement('my-el6')

			expect(el instanceof MyEl2).toBe(true)

			document.body.appendChild(el)

			expect(el.connected).toBe(undefined)
			expect(el.getProtectedMember()).toBe(true)

			document.body.removeChild(el)
		}
	})
})
