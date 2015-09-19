var HairyCreature = Class('HairyCreature', {
    HairyCreature() { // constructor
        // this.super is Object for base classes.
        this.super.apply(this, arguments)

        this.furColor = 'white'
    },

    makeSound() {
        console.log('ooooooowwhaaaa!')
    },
})

let something = new Something
something.saySomething()

var Dog = Class('Dog').extends(HairyCreature, {
    Dog() { // constructor
        this.super.apply(this, arguments)
        this.barkSound = 'woof!'
        this.furColor = 'brown'
    },

    makeSound() {
        console.log(this.barkSound)
    },
})

let dog = new Dog
dog.saySomething()
