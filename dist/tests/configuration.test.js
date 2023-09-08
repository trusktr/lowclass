import { Class, createClassHelper, staticBlacklist } from '../index.js';
const test = it;
describe('configuration', () => {
    test('ensure that class prototype and static descriptors are like ES6 classes', () => {
        const Duck = Class(({ Protected, Private }) => ({
            constructor() { },
            add() { },
            get foo() { },
            protected: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            private: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            static: {
                foo: 'foo',
                add() { },
                set foo(v) { },
            },
            test() {
                checkDescriptors(Protected(this).__proto__);
                checkDescriptors(Private(this).__proto__);
            },
        }));
        const protoDescriptor = Object.getOwnPropertyDescriptor(Duck, 'prototype');
        expect(!protoDescriptor.writable).toBeTruthy();
        expect(!protoDescriptor.enumerable).toBeTruthy();
        expect(!protoDescriptor.configurable).toBeTruthy();
        checkDescriptors(Duck);
        checkDescriptors(Duck.prototype);
        const duck = new Duck();
        duck.test();
    });
    test('Show how to change class creation configuration', () => {
        const Class = createClassHelper({
            prototypeWritable: true,
            defaultClassDescriptor: {
                enumerable: true,
                configurable: false,
            },
        });
        const AwesomeThing = Class(({ Protected, Private }) => ({
            constructor() { },
            add() { },
            get foo() { },
            protected: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            private: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            static: {
                foo: 'foo',
                add() { },
                set foo(v) { },
            },
            test() {
                checkDescriptors(Protected(this).__proto__, true, false);
                checkDescriptors(Private(this).__proto__, true, false);
            },
        }));
        const protoDescriptor = Object.getOwnPropertyDescriptor(AwesomeThing, 'prototype');
        expect(protoDescriptor.writable).toBeTruthy();
        expect(!protoDescriptor.enumerable).toBeTruthy();
        expect(!protoDescriptor.configurable).toBeTruthy();
        checkDescriptors(AwesomeThing, true, false);
        checkDescriptors(AwesomeThing.prototype, true, false);
        const thing = new AwesomeThing();
        thing.test();
    });
    test('Show how to disable setting of descriptors', () => {
        const Class = createClassHelper({
            setClassDescriptors: false,
        });
        const PeanutBrittle = Class(({ Protected, Private }) => ({
            constructor() { },
            add() { },
            get foo() { },
            protected: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            private: {
                foo: 'foo',
                add() { },
                get foo() { },
            },
            static: {
                foo: 'foo',
                add() { },
                set foo(v) { },
            },
            test() {
                checkDescriptors(Protected(this).__proto__, true, true);
                checkDescriptors(Private(this).__proto__, true, true);
            },
        }));
        const protoDescriptor = Object.getOwnPropertyDescriptor(PeanutBrittle, 'prototype');
        expect(protoDescriptor.writable).toBeTruthy();
        expect(!protoDescriptor.enumerable).toBeTruthy();
        expect(!protoDescriptor.configurable).toBeTruthy();
        checkDescriptors(PeanutBrittle, true, true);
        checkDescriptors(PeanutBrittle.prototype, true, true);
        const thing = new PeanutBrittle();
        thing.test();
    });
    function checkDescriptors(obj, enumerable = false, configurable = true) {
        const useBlacklist = typeof obj === 'function';
        const descriptors = Object.getOwnPropertyDescriptors(obj);
        let descriptor;
        expect(Object.keys(descriptors).length).toBeTruthy();
        for (const key in descriptors) {
            if (useBlacklist && staticBlacklist.includes(key))
                continue;
            descriptor = descriptors[key];
            if ('writable' in descriptor)
                expect(descriptor.writable).toBeTruthy();
            else
                expect('get' in descriptor).toBeTruthy();
            expect(descriptor.enumerable === enumerable).toBeTruthy();
            expect(descriptor.configurable === configurable).toBeTruthy();
        }
    }
    test('name classes natively (default is false)', () => {
        {
            const Class = createClassHelper({
                nativeNaming: false,
            });
            const Something = Class();
            expect(Something.name === '').toBeTruthy();
            const OtherThing = Class('OtherThing');
            expect(OtherThing.name === 'OtherThing').toBeTruthy();
            expect(!OtherThing.toString().includes('OtherThing')).toBeTruthy();
            const AwesomeThing = Class({ method() { } });
            expect(AwesomeThing.name).toBe('');
            const AwesomeThing2 = Class('AwesomeThing2', { method() { } });
            expect(AwesomeThing2.name).toBe('AwesomeThing2');
            expect(!AwesomeThing2.toString().includes('AwesomeThing2')).toBeTruthy();
        }
        {
            const Class = createClassHelper({
                nativeNaming: true,
            });
            const AnotherThing = Class();
            expect(AnotherThing.name === '').toBeTruthy();
            const YetAnotherThing = Class('YetAnotherThing');
            expect(YetAnotherThing.name === 'YetAnotherThing').toBeTruthy();
            expect(YetAnotherThing.toString().includes('YetAnotherThing')).toBeTruthy();
            const AwesomeThing = Class({ method() { } });
            expect(AwesomeThing.name).toBe('');
            const AwesomeThing2 = Class('AwesomeThing2', { method() { } });
            expect(AwesomeThing2.name).toBe('AwesomeThing2');
            expect(AwesomeThing2.toString().includes('AwesomeThing2')).toBeTruthy();
        }
    });
});
//# sourceMappingURL=configuration.test.js.map