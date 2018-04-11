
import Class from '../src/index'
import { native } from '../src/native'

// ##################################################
test('extending native Array', () => {

    const MyArray = Class().extends( native(Array), ( Public, Protected, Private ) => ({
        constructor(...args) {
            const self = super.constructor(...args)
            self.__proto__ = MyArray.prototype

            Private(self).message = 'I am Array!'

            return self
        },
        add(...args) {
            return Protected(this).add(...args)
        },
        protected: {
            add(...args) {
                return Public(this).push(...args)
            },
        },

        showMessage() {
            return Private(this).message
        },
    }))

    const a = new MyArray
    expect( a instanceof Array ).toBeTruthy()
    expect( a instanceof MyArray ).toBeTruthy()

    expect( a.showMessage() ).toBe( 'I am Array!' )

    expect( a.add(1,2,3) === 3 ).toBeTruthy()
    expect( a.length === 3 ).toBeTruthy()
    expect( a.concat(4,5,6).length === 6 ).toBeTruthy()
    expect( a.concat(4,5,6) instanceof MyArray ).toBeTruthy()
    expect( Array.isArray(a) ).toBeTruthy()

})
