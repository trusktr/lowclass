
module.exports = {
    getFunctionBody,
    setDescriptor,
    propertyIsAccessor,
    getInheritedDescriptor,
    getInheritedPropertyNames,
}

// assumes the function opening, body, and closing are on separate lines
function getFunctionBody( fn ) {
    const code = fn.toString().split("\n")
    code.shift() // remove opening line (function() {)
    code.pop() // remove closing line (})
    return code.join("\n")
}

const descriptorDefaults = {
    enumerable: true,
    configurable: true,
}

// makes it easier and less verbose to work with descriptors
function setDescriptor( obj, key, def, inherited = false ) {
    let descriptor = (
        inherited ?
        getInheritedDescriptor( obj, key ) :
        Object.getOwnPropertyDescriptor( obj, key )
    )

    descriptor = descriptor || {}

    if ( ( def.get || def.set ) && (
        typeof def.value !== 'undefined' ||
        typeof def.writable !== 'undefined'
    )) {
        throw new TypeError('cannot specify both accessors and a value or writable attribute')
    }

    if ( def.get || def.set ) {
        delete descriptor.value
        delete descriptor.writable
    }
    else if (
        typeof def.value !== 'undefined' ||
        typeof def.writable !== 'undefined'
    ) {
        delete descriptor.get
        delete descriptor.set
    }

    Object.defineProperty( obj, key,
        Object.assign( {}, descriptorDefaults, descriptor, def )
    )
}

function propertyIsAccessor( obj, key, inherited = true ) {
    let result = false
    let descriptor

    if ( arguments.length === 1 ) {
        descriptor = obj
    }
    else {
        descriptor = inherited ?
            getInheritedDescriptor( obj, key ) :
            Object.getOwnPropertyDescriptor( obj, key )
    }

    if ( descriptor && ( descriptor.get || descriptor.set ) ) result = true

    return result
}

function getInheritedDescriptor( obj, key ) {
    let currentProto = obj
    let descriptor

    while ( currentProto ) {
        descriptor = Object.getOwnPropertyDescriptor( currentProto, key )
        if ( descriptor ) return descriptor
        currentProto = currentProto.__proto__
    }
}

function getInheritedPropertyNames( obj ) {
    let currentProto = obj
    let keys = []

    while ( currentProto ) {
        keys = keys.concat( Object.getOwnPropertyNames( currentProto ) )
        currentProto = currentProto.__proto__
    }

    // remove duplicates
    keys = Array.from( new Set( keys ) )

    return keys
}
