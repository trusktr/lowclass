
module.exports = {
    getFunctionBody,
    setDescriptor,
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
function setDescriptor( obj, key, def ) {
    const descriptor = Object.getOwnPropertyDescriptor( obj, key ) || {}

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
        delete def.get
        delete def.set
    }

    Object.defineProperty( obj, key,
        Object.assign( {}, descriptorDefaults, descriptor, def )
    )
}
