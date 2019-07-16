import { Constructor } from './utils'

export default function instanceOf<T>(
    obj: any,
    Ctor: Constructor<T>
): obj is InstanceType<Constructor<T>>
