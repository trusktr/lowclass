
"use strict"

const Class = require('../index')
const { native } = require('../native')

test('works with custom elements', () => {

    // ##################################################
    // example of extending HTMLElement for use with customElements.define
    // (Custom Elements)
    if ( typeof customElements !== 'undefined' && customElements.define ) {

        // full example, wraps builting HTMLElement class with the native helper
        {
            const MyEL = Class().extends( native(HTMLElement), ({Super}) => ({

                static: {
                    observedAttributes: [ 'foo' ]
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
                    debugger
                    this.connected = true
                    this.disconnected = false
                },

                disconnectedCallback() {
                    debugger
                    this.connected = false
                    this.disconnected = true
                },

                attributeChangedCallback( attr, oldVal, newVal ) {
                    debugger
                    this[attr] = newVal
                },

            }))

            customElements.define( 'my-el', MyEL )

            const el = document.createElement( 'my-el' )
            debugger

            document.body.appendChild( el )
            expect( el.connected ).toBe( true )
            expect( el.disconnected ).toBe( false )

            el.setAttribute( 'foo', 'bar' )
            expect( el.foo ).toBe( 'bar' )

            document.body.removeChild( el )
            expect( el.connected ).toBe( false )
            expect( el.disconnected ).toBe( true )
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
                    return Reflect.construct(Super(this).constructor, [], MyEl)

                    // using native super would work here too
                    //return Reflect.construct(super.constructor, [], MyEl)

                    // we could also construct HTMLElement directly
                    //return Reflect.construct(HTMLElement, [], MyEl)
                },
                connectedCallback() {
                    this.connected = true
                },
            }))

            customElements.define('my-el', MyEl)
            const el = new MyEl
            document.body.appendChild( el )

            expect( el.connected ).toBe( true )

            document.body.removeChild( el )
        }

        // extending a Custom Elements class.
        //
        // This requires use of the Super helper (or native super), or it won't
        // work, due to how new.target works in ES2015+ enfironments and how
        // the value is retrieved in lowclass (maybe this can be improved
        // later). But anyways, why wouldn't you want to use Super or super?
        // o_O
        {
            const MyEl = Class().extends( native(HTMLElement), {
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

            customElements.define('my-el', MyEl2)
            const el = document.createElement( 'my-el' )

            // YEAAASSSSS!
            expect( el instanceof MyEl2 ).toBe( true )

            document.body.appendChild( el )

            expect( el.connected ).toBe( true )

            document.body.removeChild( el )
        }

        // What NOT to do:
        //
        // because of how lowclass handles `new.target`, this version doesn't
        // work quite as expected (yet).  You're better off using Super (or
        // native super) as in the previous example. Needing to use
        // `Reflect.construct` is a very special case that isn't completely
        // supported when subclassing (yet) unless you provide your own
        // custom-made classes to wrap with accessor helpers in which case you
        // can do anything you want with your classes (see the last example).
        {
            const MyEl = Class().extends( native(HTMLElement), {
                constructor() {

                    // passing in literal `new.target` would fail here. Because
                    // we can't do that here (try it if you want to see it
                    // fail) the following instanceof check doesn't work.
                    //
                    // Don't do either of these if subclassing:
                    return Reflect.construct(super.constructor, [], MyEl)
                    //return Reflect.construct(super.constructor, [], new.target)
                },
                connectedCallback() {
                    this.connected = true
                },
            })

            const MyEl2 = Class().extends(MyEl, (pub, pro, priv, sup) => ({
                constructor() {
                    return Reflect.construct(super.constructor, [], MyEl2)
                    //return super.constructor()
                },
                connectedCallback() {
                    super.connectedCallback()
                },
            }))

            customElements.define('my-el', MyEl2)
            const el = document.createElement( 'my-el' )

            // What the?????
            expect( el instanceof MyEl2 ).toBe( false )

            document.body.appendChild( el )

            expect( el.connected ).toBe( true )

            document.body.removeChild( el )
        }

        // if you expect your Custom Elements class to be subclassed, use only
        // Super (or native super), and only the leaf-most subclass can use
        // `Reflect.construct`
        {
            const MyEl = Class().extends( native(HTMLElement), {
                constructor() {
                    super.constructor()
                },
                connectedCallback() {
                    this.connected = true
                },
            })

            const MyEl2 = Class().extends(MyEl, (pub, pro, priv, sup) => ({
                constructor() {
                    // leafmost subclass can use `Reflect.construct` (for now)
                    return Reflect.construct(super.constructor, [], MyEl2)
                },
                connectedCallback() {
                    super.connectedCallback()
                },
            }))

            customElements.define('my-el', MyEl2)
            const el = document.createElement( 'my-el' )

            // YEAAASSSSS.
            expect( el instanceof MyEl2 ).toBe( true )

            document.body.appendChild( el )

            expect( el.connected ).toBe( true )

            document.body.removeChild( el )
        }

        // if you provide your own classes, you can do whatever you want
        {
            const MyEl = Class(({Protected}) => class extends HTMLElement {
                connectedCallback() {
                    Protected(this).connected = true
                }

                getProtectedMember() {
                    return Protected(this).connected
                }

                // define initial protected values
                static protected() { return {
                    connected: false,
                }}
            })

            const MyEl2 = Class(({Protected}) => class extends MyEl {
                constructor() {
                    // we can use native `new.target` here, for example
                    return Reflect.construct(MyEl, [], new.target)
                }

                connectedCallback() {
                    super.connectedCallback()
                }
            })

            customElements.define('my-el', MyEl2)
            const el = document.createElement( 'my-el' )

            // YEAAASSSSS.
            expect( el instanceof MyEl2 ).toBe( true )

            document.body.appendChild( el )

            expect( el.connected ).toBe( undefined )
            expect( el.getProtectedMember() ).toBe( true )

            document.body.removeChild( el )

        }
    }
})
