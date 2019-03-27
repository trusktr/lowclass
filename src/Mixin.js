import Class from './'

export default
function Mixin( factory, Default ) {

    factory = Cached( factory )
    factory = HasInstance( factory )
    factory = Dedupe( factory )
    factory = WithDefault( factory, Default || Class() )
    factory = ApplyDefault( factory )

    return factory()
}

export {
    WithDefault,
    Cached,
    HasInstance,
    ApplyDefault,
    Dedupe,
}

function WithDefault( classFactory, Default ) {
    return named(classFactory.name, Base => {
        Base = Base || Default
        return classFactory( Base )
    })
}

function Cached( classFactory ) {
    const classCache = new WeakMap

    return named(classFactory.name, Base => {
        let Class = classCache.get( Base )

        if ( !Class ) {
            classCache.set( Base, Class = classFactory( Base ) )
        }

        return Class
    })
}

function HasInstance( classFactory ) {
    let instanceofSymbol

    return named(classFactory.name, Base => {
        const Class = classFactory( Base )

        if ( typeof Symbol === 'undefined' || !Symbol.hasInstance )
            return Class

        if ( Object.getOwnPropertySymbols( Class ).includes( Symbol.hasInstance ) )
            return Class

        if ( !instanceofSymbol )
            instanceofSymbol = Symbol('instanceofSymbol')

        // NOTE we could also use a WeakMap instead of placing a flag on the
        // Class directly.
        Class[instanceofSymbol] = true

        Object.defineProperty(Class, Symbol.hasInstance, {

            value: function hasInstance(obj) {

                // we do this check because a subclass of `Class` may not have
                // it's own `[Symbol.hasInstance]()` method, therefore `this`
                // will be the subclass, not this `Class`, when the prototype
                // lookup on the subclass finds the `[Symbol.hasInstance]()`
                // method of this `Class`. In this case, we don't wsnt to run
                // our logic here, so we delegate to the super class of this
                // `Class` to take over with the instanceof check. In many
                // cases, the super class `[Symbol.hasInstance]()` method will
                // be `Function.prototype[Symbol.hasInstance]` which will
                // perform the standard check.
                if (this !== Class)
                    // This is effectively a `super` call.
                    return Class.__proto__[Symbol.hasInstance].call(this, obj)

                let currentProto = obj

                while(currentProto) {
                    const descriptor = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                    if (
                        descriptor &&
                        descriptor.value &&
                        descriptor.value.hasOwnProperty(instanceofSymbol)
                    ) return true

                    currentProto = currentProto.__proto__
                }

                return false

            }

        })

        return Class
    })
}

// requires WithDefault or a classFactory that can accept no args
function ApplyDefault( classFactory ) {
    const DefaultClass = classFactory()
    DefaultClass.mixin = classFactory
    return classFactory
}

// requires Cached
function Dedupe( classFactory ) {
    const map = new WeakMap

    return named(classFactory.name, Base => {

        if ( hasMixin( Base, classFactory, map ) )
            return Base

        const Class = classFactory( Base )
        map.set( Class, classFactory )
        return Class
    })
}

function hasMixin( Class, mixin, map ) {
    while (Class) {
        if ( map.get(Class) === mixin ) return true
        Class = Class.__proto__
    }

    return false
}

function named(name, func) {
    try {
        Object.defineProperty(func, 'name', {
            ...Object.getOwnPropertyDescriptor(func, 'name'),
            value: name
        })
    } catch(e) {
        // do nohing in case the property is non-configurable.
    }
    
    return func
}
