/** Like Object.getOwnPropertyNames, but gets property names including from ancestor prototypes. */
export function getInheritedPropertyNames<T extends object>(obj: T): (keyof T)[] {
	let currentProto = obj
	let keys: (keyof T)[] = []

	while (currentProto) {
		keys = keys.concat(Object.getOwnPropertyNames(currentProto) as (keyof T)[])
		currentProto = (currentProto as any).__proto__
	}

	// remove duplicates
	keys = Array.from(new Set(keys))

	return keys
}
