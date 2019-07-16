import { Constructor } from './utils'

export { newless as native }

export default newless

type FuncLikeCtor<T, S = {}> = {
    (): T
    new (): T
} & S

declare function newless<T extends Constructor>(ctor: T): FuncLikeCtor<InstanceType<T>, T>
