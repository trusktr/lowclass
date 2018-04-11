
import Class from '../src/index'
import { native } from '../src/native'

test('extend native class, and using Super helper', () => {

    class Foo {
        constructor( msg ) {
            this.message = msg
        }

        method() {
            return this.message
        }
    }

    // TODO auto-detect `class`es
    const Bar = Class().extends( native(Foo), ({Super}) => ({
        constructor( msg ) {
            Super(this).constructor( msg )

            this.message += '!'
        },

        method() {
            return Super(this).method()
        },
    }))

    const b = new Bar( 'it works' )

    expect( b instanceof Bar ).toBeTruthy()
    expect( b instanceof Foo ).toBeTruthy()
    expect( b.method() === 'it works!' ).toBeTruthy()

})

test('extend native class, and using native `super`', () => {

    class Foo {
        constructor( msg ) {
            this.message = msg
        }

        method() {
            return this.message
        }
    }

    const Bar = Class().extends( native(Foo), {
        constructor( msg ) {
            super.constructor( msg )

            this.message += '!'
        },

        method() {
            return super.method()
        },
    })

    const b = new Bar( 'it works' )

    expect( b instanceof Bar ).toBeTruthy()
    expect( b instanceof Foo ).toBeTruthy()
    expect( b.method() === 'it works!' ).toBeTruthy()

})
