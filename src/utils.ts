// TODO no any

export class WeakTwoWayMap {
	m = new WeakMap()
	set(a: Object, b: Object) {
		this.m.set(a, b)
		this.m.set(b, a)
	}
	get(item: Object) {
		return this.m.get(item)
	}
	has(item: Object) {
		return this.m.has(item)
	}
}

// assumes the function opening, body, and closing are on separate lines
export function getFunctionBody(fn: Function): string {
	const code = fn.toString().split('\n')
	code.shift() // remove opening line (function() {)
	code.pop() // remove closing line (})
	return code.join('\n')
}

const descriptorDefaults = {
	enumerable: true,
	configurable: true,
}

// makes it easier and less verbose to work with descriptors
export function setDescriptor(obj: Object, key: string, newDescriptor: PropertyDescriptor, inherited = false): void {
	let currentDescriptor = inherited ? getInheritedDescriptor(obj, key) : Object.getOwnPropertyDescriptor(obj, key)

	newDescriptor = overrideDescriptor(currentDescriptor, newDescriptor)
	Object.defineProperty(obj, key, newDescriptor)
}

export function setDescriptors(obj: Object, newDescriptors: Record<string, PropertyDescriptor>): void {
	let newDescriptor
	let currentDescriptor
	const currentDescriptors = Object.getOwnPropertyDescriptors(obj)

	for (const key in newDescriptors) {
		newDescriptor = newDescriptors[key]
		currentDescriptor = currentDescriptors[key]
		newDescriptors[key] = overrideDescriptor(currentDescriptor, newDescriptor)
	}

	Object.defineProperties(obj, newDescriptors)
}

function overrideDescriptor(
	oldDescriptor: PropertyDescriptor | undefined,
	newDescriptor: PropertyDescriptor,
): PropertyDescriptor {
	if (
		('get' in newDescriptor || 'set' in newDescriptor) &&
		('value' in newDescriptor || 'writable' in newDescriptor)
	) {
		throw new TypeError('cannot specify both accessors and a value or writable attribute')
	}

	if (oldDescriptor) {
		if ('get' in newDescriptor || 'set' in newDescriptor) {
			delete oldDescriptor.value
			delete oldDescriptor.writable
		} else if ('value' in newDescriptor || 'writable' in newDescriptor) {
			delete oldDescriptor.get
			delete oldDescriptor.set
		}
	}

	return {...descriptorDefaults, ...oldDescriptor, ...newDescriptor}
}

// TODO use signature override
export function propertyIsAccessor(obj: Object | PropertyDescriptor, key?: string, inherited = true): boolean {
	let result = false
	let descriptor: PropertyDescriptor | undefined

	if (arguments.length === 1) {
		descriptor = obj
	} else {
		descriptor = inherited ? getInheritedDescriptor(obj, key!) : Object.getOwnPropertyDescriptor(obj, key!)
	}

	if (descriptor && (descriptor.get || descriptor.set)) result = true

	return result
}

interface DescriptorWithOwner extends PropertyDescriptor {
	owner: object
}

export function getInheritedDescriptor(obj: object, key: string): DescriptorWithOwner | undefined {
	let currentProto = obj
	let descriptor

	while (currentProto) {
		descriptor = Object.getOwnPropertyDescriptor(currentProto, key)

		if (descriptor) {
			;(descriptor as DescriptorWithOwner).owner = currentProto
			return descriptor as DescriptorWithOwner
		}

		currentProto = (currentProto as any).__proto__
	}

	return void 0
}

export function getInheritedPropertyNames(obj: Object): string[] {
	let currentProto = obj
	let keys: string[] = []

	while (currentProto) {
		keys = keys.concat(Object.getOwnPropertyNames(currentProto))
		currentProto = (currentProto as any).__proto__
	}

	// remove duplicates
	keys = Array.from(new Set(keys))

	return keys
}

export type Constructor<T = object, A extends any[] = any[], Static = {}> = (new (...a: A) => T) & Static

// this is used for type casting in special cases, see the declaration file
export function Constructor<T = object, Static = {}>(Ctor: Constructor<any>): Constructor<T> & Static {
	return (Ctor as unknown) as Constructor<T> & Static
}

// check if an object has the given prototype in its chain
export function hasPrototype(obj: any, proto: any) {
	let currentProto = obj.__proto__

	do {
		if (proto === currentProto) return true
		currentProto = currentProto.__proto__
	} while (currentProto)

	return false
}

// copy all properties (as descriptors) from source to destination
export function copyDescriptors(source: Object, destination: Object, mod?: any) {
	const props = Object.getOwnPropertyNames(source)
	let i = props.length
	while (i--) {
		const prop = props[i]
		const descriptor = Object.getOwnPropertyDescriptor(source, prop)
		if (mod) mod(descriptor)
		Object.defineProperty(destination, prop, descriptor!)
	}
}

export function setDefaultPrototypeDescriptors(
	prototype: Object,
	{defaultClassDescriptor: {writable, enumerable, configurable}}: any,
) {
	const descriptors = Object.getOwnPropertyDescriptors(prototype)
	let descriptor

	for (const key in descriptors) {
		descriptor = descriptors[key]

		// regular value
		if ('value' in descriptor || 'writable' in descriptor) {
			descriptor.writable = writable
		}

		// accessor or regular value
		descriptor.enumerable = enumerable
		descriptor.configurable = configurable
	}

	setDescriptors(prototype, descriptors)
}

export function setDefaultStaticDescriptors(
	Ctor: any,
	{defaultClassDescriptor: {writable, enumerable, configurable}}: any,
	staticBlacklist?: (string | symbol)[],
) {
	const descriptors = Object.getOwnPropertyDescriptors(Ctor)
	let descriptor

	for (const key in descriptors) {
		if (staticBlacklist && staticBlacklist.includes(key)) {
			delete descriptors[key]
			continue
		}

		descriptor = descriptors[key]

		// regular value
		if ('value' in descriptor || 'writable' in descriptor) {
			descriptor.writable = writable
		}

		// accessor or regular value
		descriptor.enumerable = enumerable
		descriptor.configurable = configurable
	}

	setDescriptors(Ctor, descriptors)
}
