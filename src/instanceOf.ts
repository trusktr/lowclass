import {Constructor} from './utils'

// helper function to use instead of instanceof for classes that implement the
// static Symbol.hasInstance method, because the behavior of instanceof isn't
// polyfillable.
export default function instanceOf<T>(
	instance: any,
	Constructor: Constructor<T>,
): instance is InstanceType<Constructor<T>> {
	if (typeof Constructor == 'function' && Constructor[Symbol.hasInstance])
		return Constructor[Symbol.hasInstance](instance)
	else return instance instanceof Constructor
}
