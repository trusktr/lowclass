
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

function setDescriptor( obj, key, def ) {
    const descriptor = Object.getOwnPropertyDescriptor( obj, key ) || def
    if ( descriptor !== def ) Object.assign( descriptor, def )
    Object.defineProperty( obj, key, descriptor )
}
