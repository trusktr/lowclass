// the bread and butter
export * from './Class.js'
import Class from './Class.js'
export default Class

// mix and match your classes!
export * from './multiple.js'
export * from './Mixin.js'

// extras
export {default as instanceOf} from './instanceOf.js'
export * from './native.js'
export * from './utils.js'

export * from './types.js'

export const version = '4.9.1'
