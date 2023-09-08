import { Constructor } from './utils.js';
export { newless as native };
export default newless;
declare type FuncLikeCtor<T, S = {}> = {
    (): T;
    new (): T;
} & S;
declare function newless<T extends Constructor>(constructor: T): FuncLikeCtor<InstanceType<T>, T>;
//# sourceMappingURL=native.d.ts.map