
const Class = require('../index')

test('no access of parent private data in subclass', () => {
    const MyClass = Class( ({ Private }) => {

        return class MyClass {

            constructor() {
                Private(this).privateProperty = "yoohoo"
            }

        }

    })

    const MyOtherClass = Class( ({Private}) => {

        return class MyOtherClass extends MyClass {

            otherMethod() {
                return Private(this).privateProperty
            }

        }

    })

    const instance = new MyOtherClass

    expect( instance.otherMethod() ).toBe( undefined )
})

test('', () => {
    const MyClass = Class( ({ Private }) => {

        return class MyClass {

            constructor() {
                Private(this).privateProperty = "yoohoo"
            }

            someMethod() {
                return Private(this).privateProperty
            }

            changeIt() {
                Private(this).privateProperty = 'oh yeah'
            }

        }

    })

    const MyOtherClass = Class( ({ Private }) => {

        return class MyOtherClass extends MyClass {

            otherMethod() {
                return Private(this).privateProperty
            }

            makeItSo() {
                Private(this).privateProperty = 'it is so'
            }

        }

    })

    const instance = new MyOtherClass

    expect( instance.someMethod() ).toBe( 'yoohoo' )
    expect( instance.otherMethod() ).toBe( undefined )

    instance.changeIt()
    expect( instance.someMethod() ).toBe( 'oh yeah' )
    expect( instance.otherMethod() ).toBe( undefined )

    instance.makeItSo()
    expect( instance.someMethod() ).toBe( 'oh yeah' )
    expect( instance.otherMethod() ).toBe( 'it is so' )
})
