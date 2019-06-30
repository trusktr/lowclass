// the bread and butter
export * from './Class'
import Class from './Class'
export default Class

// mix and match your classes!
export * from './Mixin'

// extras
export { default as instanceOf } from './instanceOf'
export * from './native'
export * from './utils'

// shared types only
export * from './types'

export const version: string
