const Class = require('./src/index')
const InvalidAccessError = Class.InvalidAccessError

console.log(' ################################################## ')

// we should not be able to access protected members from unrelated code
try {
    const Dog = Class('Dog', (public, protected, private) => {
        protected.sound = "Woof!"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        private.ipsum = 'ipsum'
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('Try to access PROTECTED member from unrelated class:', protected(dog).sound)
        }
    })

    let u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, there was an error on invalid PROTECTED access')
    else throw e
}

console.log(' ################################################## ')

// we should not be able to access private members from unrelated code
try {
    const Dog = Class('Dog', (public, protected, private) => {
        private.breed = "labrador"
    })

    const UnrelatedClass = Class(function UnrelatedClass(public, protected, private) {
        private.ipsum = 'ipsum'
        public.testInvalidAccess = function() {
            const dog = new Dog
            console.log('Try to access PRIVATE member from unrelated class:', private(dog).breed)
        }
    })

    const u = new UnrelatedClass
    u.testInvalidAccess()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, there was an error on invalid PRIVATE access')
    else throw e
}

console.log(' ################################################## ')

// we can access a protected member from a super class
try {
    const Animal = Class('Animal', (public, protected, private) => ({
        getDogSound: function talk() {
            const dog = new Dog
            return protected(dog).sound
        },
    }))

    const Dog = Animal.subclass('Dog', (public, protected) => {
        protected.sound = "Woof!"
    })

    const animal = new Animal
    const dogSound = animal.getDogSound()

    console.assert( dogSound === 'Woof!' )
}
catch (e) {
    console.log('ERROR, there shouldn\'t have been a problem accessing PROTECTED stuff from Dog')
    throw e
}

console.log(' ################################################## ')

// we can access a protected member from a child class
try {
    const Animal = Class('Animal', (public, protected, private) => {
        protected.alive = true
    })

    const Dog = Animal.subclass('Dog', (public, protected) => ({
        isAlive() {
            return protected(this).alive
        }
    }))

    const dog = new Dog
    console.assert( dog.isAlive() === true )
}
catch (e) {
    console.log('ERROR, there shouldn\'t have been a problem accessing PROTECTED stuff from Dog')
    throw e
}

console.log(' ################################################## ')

// we can not access a child class' private member from a parent class
try {

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            foo: function talk() {
                const dog = new Dog

                console.log('Try to access Dog\'s PRIVATE member from Animal:', private(dog).sound)

                private(dog).bar = 'NOT BAR'

                // access privates only from code of the same class
                console.assert( private(this).bar === 'BAR' )
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
    })

    const animal = new Animal('Ranchuu')
    animal.foo()

    throw new Error('ERROR, we should not have reached this point')
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, we were not able to access Dog\'s PRIVATE member.')
    else throw e
}

console.log(' ################################################## ')

// we can not access a parent class' private member from a child class
try {

    const Animal = Class('Animal', (public, protected, private) => ({
        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.foo = function() {

            // should not be able to access Animal's private bar property
            console.assert( private(this).bar === undefined )
            console.assert( this.bar === undefined )
        }
    })

    const dog = new Dog
    dog.foo()
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, we were not able to access Animal\'s PRIVATE member.')
    else throw e
}

console.log(' ################################################## ')

// we can not access a child class' private member from a parent class
try {

    const Animal = Class('Animal', (public, protected, private) => ({
        public: {
            foo: function talk() {
                const dog = new Dog

                console.log('Try to access Dog\'s PRIVATE member from Animal:', private(dog).sound)

                private(dog).bar = 'NOT BAR'

                // access privates only from code of the same class
                console.assert( private(this).bar === 'BAR' )
            },
        },

        private: {
            bar: 'BAR',
        },
    }))

    const Dog = Animal.subclass(function Dog(public, protected, private) {
        private.sound = "Woof!"
    })

    const animal = new Animal('Ranchuu')
    animal.foo()

    throw new Error('ERROR, we should not have reached this point')
}
catch (e) {
    if ( e instanceof InvalidAccessError )
        console.log('SUCCESS, we were not able to access Dog\'s PRIVATE member.')
    else throw e
}

console.log(' ################################################## ')

// private members can be accessed only from the class where they are defined
try {

    const Dog = Class(function Dog(public, protected, private) {
        private.sound = "Woof!"
        public.talk = function() {
            console.assert( private(this).sound === "Woof!" )
        }
    })

    const dog = new Dog()

    // set public `sound` property
    dog.sound = 'awooo!'
    console.assert( dog.sound === 'awooo!' )

    dog.talk()

}
catch (e) {
    throw e
}

console.log(' All tests passed! ')
