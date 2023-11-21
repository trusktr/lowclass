import { multiple } from './multiple.js';
const log = console.log.bind(console);
const assert = console.assert.bind(console);
runTests();
function runTests() {
    log('testing...');
    test0();
    test1();
    test2; // TODO, constructor args
    test3();
    test4();
    test5();
    test6();
    test7();
    testAccessPropFromSubInstanceInMainInstance();
    // time the Proxy-based version
    log('testing speed of Proxy version...');
    const start1 = performance.now();
    for (let i = 0; i < 10000; i++)
        testProxySpeed();
    const end1 = performance.now();
    const totalTime1 = end1 - start1;
    log(`...done. Total time for Proxy version: ${totalTime1}ms`);
    // time the class-factory-mixin-based version
    log('testing speed of class-factory-mixin version...');
    const start2 = performance.now();
    for (let i = 0; i < 10000; i++)
        testMixinSpeed();
    const end2 = performance.now();
    const totalTime2 = end2 - start2;
    log(`...done. Total time class-factory-mixin version: ${totalTime2}ms`);
    log(`${totalTime1 < totalTime2 ? 'Proxy version' : 'class-factory-mixin'} version was faster than ${totalTime1 < totalTime2 ? 'class-factory-mixin' : 'Proxy'} version by a factor of ${totalTime1 < totalTime2 ? totalTime2 / totalTime1 : totalTime1 / totalTime2}`);
}
function hasProto(obj, proto) {
    let current = obj.__proto__;
    while ((current = current.__proto__))
        if (current === proto)
            return true;
    return false;
}
function test0() {
    const R1 = multiple();
    const r1 = new R1();
    console.log('length');
    assert(Object.keys(r1).length === 0);
    assert(r1.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(Object.getPrototypeOf(r1) === Object.prototype);
    class Foo {
        f = false;
    }
    const R2 = multiple(Foo);
    const r2 = new R2();
    assert(r2.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(Object.getPrototypeOf(r2) === Foo.prototype);
    assert(r2.f === false);
    class Bar {
        b = 'asf';
    }
    const R3 = multiple(Foo, Bar);
    const r3 = new R3();
    assert(r3.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(hasProto(r3, Foo.prototype));
    assert(!hasProto(r3, Bar.prototype));
    assert(r3.f === false);
    assert(r3.b === 'asf');
    const BarFoo = multiple(Bar, Foo);
    const bf = new BarFoo();
    assert(bf.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(hasProto(bf, Bar.prototype));
    assert(!hasProto(bf, Foo.prototype));
    assert(bf.f === false);
    assert(bf.b === 'asf');
    class Baz {
        z = 1;
    }
    const R4 = multiple(Foo, Bar, Baz);
    const r4 = new R4();
    assert(r4.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(r4.f === false);
    assert(r4.b === 'asf');
    assert(r4.z === 1);
}
function test1() {
    class One {
        one = 1;
        foo() {
            assert(this.one === 1);
        }
        var;
        setVar() {
            this.var = 'bright';
        }
    }
    class Two {
        two = 2;
        bar() {
            assert(this.two === 2);
        }
        readVar() {
            // this is generally not allowed by the type system, siblings
            // classes don't magically know about each other (Two does not know
            // about One because Two does not inherit from One), but this proves
            // that the inheritance works in like in plain JS.
            assert(this.var === 'bright'); // should be "bright"
        }
    }
    class Three extends Two {
        three = 3;
        baz() {
            assert(typeof super.bar === 'function');
            super.bar();
            assert(this.three === 3 && this.two === 2);
        }
    }
    class FooBar extends multiple(Three, One) {
        yeah() {
            assert(this.one === 1 && this.two === 2 && this.three === 3);
            super.baz();
            super.foo();
        }
    }
    const f = new FooBar();
    // this shows that the modifications to `this` by each constructor worked:
    assert(f.one === 1 && f.two === 2 && f.three === 3);
    // all methods work:
    f.foo();
    f.bar();
    f.baz();
    f.yeah();
    f.setVar();
    f.readVar();
}
function test2() {
    // test constructor args
    class One {
        one;
        constructor(arg) {
            this.one = arg;
        }
        foo() {
            assert(this.one === 4);
        }
    }
    class Two {
        two;
        constructor(arg) {
            this.two = arg;
        }
        bar() {
            assert(this.two === 5);
        }
    }
    class Three extends Two {
        three;
        constructor(arg1, arg2) {
            super(arg1);
            this.three = arg2;
        }
        baz() {
            assert(typeof super.bar === 'function');
            super.bar();
            assert(this.three === 6 && this.two === 5);
        }
    }
    class FooBar extends multiple(Three, One) {
        constructor(..._args) {
            super();
            // TODO ability to call individual constructors with specific args.
            // call each constructor. We can pas specific args to each constructor if we like.
            //
            // XXX The following is not allowed with ES6 classes, class constructors are not callable. :[ How to solve?
            // One.call(this, ...args)
            // Three.call(this, ...args)
            //
            // XXX Solved with the callSuperConstructor helper.
            // ;(this as any).callSuperConstructor(One, args[0])
            // ;(this as any).callSuperConstructor(Three, args[1], args[2])
        }
        yeah() {
            assert(this.one === 1 && this.two === 2 && this.three === 3);
            super.baz();
            super.foo();
        }
    }
    const f = new FooBar(4, 5, 6);
    // this shows that the modifications to `this` by each constructor worked:
    assert(f.one === 4 && f.two === 5 && f.three === 6);
    // all methods work:
    f.foo();
    f.bar();
    f.baz();
    f.yeah();
}
function test3() {
    class One {
        one = 1;
        foo() {
            assert(this.one === 1);
        }
    }
    class Two {
        two = 2;
        bar() {
            assert(this.two == 2);
        }
    }
    class Three extends Two {
        three = 3;
        baz() {
            super.bar();
            assert(this.three === 3 && this.two === 2);
        }
    }
    class FooBar extends multiple(Three, One) {
        yeah() {
            assert(this.one === 1 && this.two === 2 && this.three === 3);
            super.baz();
            super.foo();
        }
    }
    class Lorem {
        lo = 'rem';
    }
    {
        class Ipsum extends multiple(FooBar, Lorem) {
            ip = 'sum';
            test() {
                assert(typeof super.foo === 'function');
                assert(typeof super.bar === 'function');
                assert(typeof super.baz === 'function');
                assert(typeof super.yeah === 'function');
                super.bar();
                assert(this.lo === 'rem' && this.ip === 'sum');
            }
        }
        const i = new Ipsum();
        i.foo();
        i.bar();
        i.baz();
        i.yeah();
        i.test();
    }
    {
        class Ipsum extends multiple(Lorem, FooBar) {
            ip = 'sum';
            test() {
                assert(typeof super.foo === 'function');
                assert(typeof super.bar === 'function');
                assert(typeof super.baz === 'function');
                assert(typeof super.yeah === 'function');
                super.bar();
                assert(this.lo === 'rem' && this.ip === 'sum');
            }
        }
        const i = new Ipsum();
        i.foo();
        i.bar();
        i.baz();
        i.yeah();
        i.test();
    }
}
function test4() {
    class One {
        one = 1;
        logOne() {
            assert(this.one === 1);
        }
    }
    class Two {
        two = 2;
        logTwo() {
            assert(this.two === 2);
        }
    }
    class Three extends multiple(One, Two) {
        three = 3;
        logThree() {
            assert(this.one === 1);
            assert(this.two === 2);
            assert(this.three === 3);
        }
    }
    const three = new Three();
    three.logOne();
    three.logTwo();
    three.logThree();
    class Four {
        four = 4;
        logFour() {
            assert(this.four === 4);
        }
    }
    class Five {
        five = 5;
        logFive() {
            assert(this.five === 5);
        }
    }
    class Six extends multiple(Four, Five) {
        six = 6;
        logSix() {
            assert(this.four === 4 && this.five === 5 && this.six === 6);
        }
    }
    const six = new Six();
    six.logFour();
    six.logFive();
    six.logSix();
}
function test5() {
    class One {
        one = 1;
        logOne() {
            assert(this.one === 1);
        }
    }
    class Two {
        two = 2;
        logTwo() {
            assert(this.two === 2);
        }
    }
    class Three extends multiple(One, Two) {
        three = 3;
        logThree() {
            assert(this.one === 1);
            assert(this.two === 2);
            assert(this.three === 3);
        }
    }
    class Four {
        four = 4;
        logFour() {
            assert(this.four === 4);
        }
    }
    class Five {
        five = 5;
        logFive() {
            assert(this.five === 5);
        }
    }
    class Six extends multiple(Four, Five) {
        six = 6;
        logSix() {
            assert(this.four === 4 && this.five === 5 && this.six === 6);
        }
        logSeven() {
            // crap, look at the subclass below, it has an error. :(
            console.log(' --------- yeaaaaaaaaaaaaaaaaaaaaah');
        }
    }
    class Seven extends multiple(Three, Six) {
        seven = 7;
        // @ts-ignore
        logSeven() {
            console.log(' --------- about to call super');
            super.logSeven();
            assert(this.one === 1, `expected ${this.one} to be ${1}`);
            assert(this.two === 2, `expected ${this.two} to be ${2}`);
            assert(this.three === 3, `expected ${this.three} to be ${3}`);
            assert(this.four === 4, `expected ${this.four} to be ${4}`);
            assert(this.five === 5, `expected ${this.five} to be ${5}`);
            assert(this.six === 6, `expected ${this.six} to be ${6}`);
            assert(this.seven === 7, `expected ${this.six} to be ${7}`);
            this.logOne();
            this.logTwo();
            this.logThree();
            this.logFour();
            this.logFive();
            this.logSix();
        }
    }
    const seven = new Seven();
    seven.logSeven();
    class Seven2 extends multiple(Three, Six) {
        seven = 7;
        // @ts-ignore
        logSeven() {
            assert(this.seven === 7, 'assert this.seven is 7');
            // super property access is just like with normal property access:
            // because they don't exist on the prototype, the super access
            // returns undefined.
            assert(super.one === undefined, `expected ${super.one} to be ${undefined}`);
            assert(super.two === undefined, `expected ${super.two} to be ${undefined}`);
            assert(super.three === undefined, `expected ${super.three} to be ${undefined}`);
            assert(super.four === undefined, `expected ${super.four} to be ${undefined}`);
            assert(super.five === undefined, `expected ${super.five} to be ${undefined}`);
            assert(super.six === undefined, `expected ${super.six} to be ${undefined}`);
            super.logOne();
            super.logTwo();
            super.logThree();
            super.logFour();
            super.logFive();
            super.logSix();
        }
    }
    const seven2 = new Seven2();
    seven2.logSeven();
    // check that the `in` operator works
    assert('one' in seven2);
    assert('two' in seven2);
    assert('three' in seven2);
    assert('four' in seven2);
    assert('five' in seven2);
    assert('six' in seven2);
    assert('seven' in seven2);
}
function test6() {
    let count = 0;
    class One {
    }
    class Two {
        two = 2;
        method2() {
            count++;
            assert(this.two === 2, 'two should be 2');
        }
    }
    class Three extends multiple(One, Two) {
        method3() {
            this.method2();
        }
    }
    const three = new Three();
    three.method3();
    class Four {
    }
    class Five extends multiple(Four, Three) {
        method5() {
            this.method3();
        }
    }
    const five = new Five();
    five.method5();
    class Six {
    }
    class Seven extends multiple(Six, Five) {
        method7() {
            this.method5();
        }
    }
    const s = new Seven();
    s.method7();
    class Eight {
    }
    class Nine extends multiple(Eight, Seven) {
        method8() {
            this.method7();
        }
    }
    const n = new Nine();
    n.method8();
    assert(count === 4, 'method2 should be called 4 times');
}
function test7() {
    let count = 0;
    class One {
    }
    class Two {
        two = 2;
        method2() {
            ++count;
            assert(this.two === 2, 'two should be 2');
        }
    }
    class Three extends multiple(One, Two) {
        method3() {
            this.method2();
        }
    }
    // this worked before, there were no problems with the assertion in method2
    const three = new Three();
    three.method3();
    class Four {
    }
    class Five extends multiple(Four, Three) {
        // The problem started here, because Three was instantiated inside of Five's
        // constructor during instantiation of Seven, so the `new Three` and
        // it's underlying `new Two` were treated as if they were sub-instances of
        // Seven instead of Five, which wasn't what we wanted, so property lookups didn't work right.
        t = new Three();
        constructor() {
            super();
            this.t.method3();
        }
        method5() {
            this.method3();
            this.t.method3();
        }
    }
    // This worked before, the assertion in method2 was fine at this point
    const five = new Five();
    five.method5();
    // we needed to make one more layer of multiple inheritance for the problem to become apparent.
    class Six {
    }
    class Seven extends multiple(Six, Five) {
        method7() {
            this.method5();
        }
    }
    // this was breaking, the assertion in the inherited method2 was failing,
    // because the `Two` instance got inserted into the `instances` array for
    // the Seven instance, instead of for the Three instance.
    const s = new Seven();
    s.method7();
    assert(count === 7, 'method2 should be called 7 times');
}
function testProxySpeed() {
    class One {
        one = 1;
        logOne() {
            this.one === 1;
        }
    }
    class Two {
        two = 2;
        logTwo() {
            this.two === 2;
        }
    }
    class Three extends multiple(One, Two) {
        three = 3;
        logThree() {
            this.one === 1;
            this.two === 2;
            this.three === 3;
        }
    }
    class Four {
        four = 4;
        logFour() {
            this.four === 4;
        }
    }
    class Five {
        five = 5;
        logFive() {
            this.five === 5;
        }
    }
    class Six extends multiple(Four, Five) {
        six = 6;
        logSix() {
            this.four === 4 && this.five === 5 && this.six === 6;
        }
    }
    class Seven extends multiple(Three, Six) {
        seven = 7;
        logSeven() {
            this.one === 1, `expected ${this.one} to be ${1}`;
            this.two === 2, `expected ${this.two} to be ${2}`;
            this.three === 3, `expected ${this.three} to be ${3}`;
            this.four === 4, `expected ${this.four} to be ${4}`;
            this.five === 5, `expected ${this.five} to be ${5}`;
            this.six === 6, `expected ${this.six} to be ${6}`;
            this.seven === 7, `expected ${this.six} to be ${7}`;
            this.logOne();
            this.logTwo();
            this.logThree();
            this.logFour();
            this.logFive();
            this.logSix();
        }
    }
    const seven = new Seven();
    seven.logSeven();
    class Seven2 extends multiple(Three, Six) {
        seven = 7;
        logSeven() {
            this.seven === 7, 'assert this.seven is 7';
            // super property access is just like with normal property access:
            // because they don't exist on the prototype, the super access
            // returns undefined.
            super.one === undefined, `expected ${super.one} to be ${undefined}`;
            super.two === undefined, `expected ${super.two} to be ${undefined}`;
            super.three === undefined, `expected ${super.three} to be ${undefined}`;
            super.four === undefined, `expected ${super.four} to be ${undefined}`;
            super.five === undefined, `expected ${super.five} to be ${undefined}`;
            super.six === undefined, `expected ${super.six} to be ${undefined}`;
            super.logOne();
            super.logTwo();
            super.logThree();
            super.logFour();
            super.logFive();
            super.logSix();
        }
    }
    const seven2 = new Seven2();
    seven2.logSeven();
    // check that the `in` operator works
    'one' in seven2;
    'two' in seven2;
    'three' in seven2;
    'four' in seven2;
    'five' in seven2;
    'six' in seven2;
    'seven' in seven2;
}
function testMixinSpeed() {
    function OneMixin(Base = Object) {
        return class One extends Base {
            one = 1;
            logOne() {
                this.one === 1;
            }
        };
    }
    function TwoMixin(Base = Object) {
        return class Two extends Base {
            two = 2;
            logTwo() {
                this.two === 2;
            }
        };
    }
    function ThreeMixin(Base = Object) {
        return class Three extends OneMixin(TwoMixin(Base)) {
            three = 3;
            logThree() {
                this.one === 1;
                this.two === 2;
                this.three === 3;
            }
        };
    }
    function FourMixin(Base = Object) {
        return class Four extends Base {
            four = 4;
            logFour() {
                this.four === 4;
            }
        };
    }
    function FiveMixin(Base = Object) {
        return class Five extends Base {
            five = 5;
            logFive() {
                this.five === 5;
            }
        };
    }
    function SixMixin(Base = Object) {
        return class Six extends FourMixin(FiveMixin(Base)) {
            six = 6;
            logSix() {
                this.four === 4 && this.five === 5 && this.six === 6;
            }
        };
    }
    class Seven extends ThreeMixin(SixMixin()) {
        seven = 7;
        logSeven() {
            this.one === 1, `expected ${this.one} to be ${1}`;
            this.two === 2, `expected ${this.two} to be ${2}`;
            this.three === 3, `expected ${this.three} to be ${3}`;
            this.four === 4, `expected ${this.four} to be ${4}`;
            this.five === 5, `expected ${this.five} to be ${5}`;
            this.six === 6, `expected ${this.six} to be ${6}`;
            this.seven === 7, `expected ${this.six} to be ${7}`;
            this.logOne();
            this.logTwo();
            this.logThree();
            this.logFour();
            this.logFive();
            this.logSix();
        }
    }
    const seven = new Seven();
    seven.logSeven();
    class Seven2 extends ThreeMixin(SixMixin()) {
        seven = 7;
        logSeven() {
            this.seven === 7, '.seven is 7';
            // super property access is just like with normal property access:
            // because they don't exist on the prototype, the super access
            // returns undefined.
            super.one === undefined, `expected ${super.one} to be ${undefined}`;
            super.two === undefined, `expected ${super.two} to be ${undefined}`;
            super.three === undefined, `expected ${super.three} to be ${undefined}`;
            super.four === undefined, `expected ${super.four} to be ${undefined}`;
            super.five === undefined, `expected ${super.five} to be ${undefined}`;
            super.six === undefined, `expected ${super.six} to be ${undefined}`;
            super.logOne();
            super.logTwo();
            super.logThree();
            super.logFour();
            super.logFive();
            super.logSix();
        }
    }
    const seven2 = new Seven2();
    seven2.logSeven();
    // check that the `in` operator works
    'one' in seven2;
    'two' in seven2;
    'three' in seven2;
    'four' in seven2;
    'five' in seven2;
    'six' in seven2;
    'seven' in seven2;
}
function testAccessPropFromSubInstanceInMainInstance() {
    class One {
        test1() {
            // @ts-ignore
            assert(this.three === 3);
        }
    }
    class Two {
        test2() {
            // @ts-ignore
            assert(this.three === 3);
        }
    }
    class Three extends multiple(One, Two) {
        three = 3;
    }
    new Three().test1();
    new Three().test2();
}
//# sourceMappingURL=multiple.test.js.map