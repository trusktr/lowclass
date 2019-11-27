// the bread and butter
export * from './Class'
import Class from './Class'
export default Class

// mix and match your classes!
export * from './multiple'
export * from './Mixin'

// extras
export {default as instanceOf} from './instanceOf'
export * from './native'
export * from './utils'

export const version = '4.8.0'
