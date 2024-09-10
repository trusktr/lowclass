import type { Constructor } from './Constructor.js';
/**
 * A ponyfill for `instanceof` with support for Symbol.hasInstance for older
 * environments. Use in place of native `instanceof`.
 */
export default function instanceOf<T>(instance: any, Constructor: Constructor<T>): instance is InstanceType<Constructor<T>>;
//# sourceMappingURL=instanceOf.d.ts.map