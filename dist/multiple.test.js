import { multiple } from './multiple.js';
const log = console.log.bind(console);
const assert = console.assert.bind(console);
runTests();
function runTests() {
    log('testing...');
    test0();
    test1();
    test2;
    test3();
    test4();
    test5();
    test6();
    test7();
    testAccessPropFromSubInstanceInMainInstance();
    log('testing speed of Proxy version...');
    const start1 = performance.now();
    for (let i = 0; i < 10000; i++)
        testProxySpeed();
    const end1 = performance.now();
    const totalTime1 = end1 - start1;
    log(`...done. Total time for Proxy version: ${totalTime1}ms`);
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
        constructor() {
            this.f = false;
        }
    }
    const R2 = multiple(Foo);
    const r2 = new R2();
    assert(r2.hasOwnProperty === Object.prototype.hasOwnProperty);
    assert(Object.getPrototypeOf(r2) === Foo.prototype);
    assert(r2.f === false);
    class Bar {
        constructor() {
            this.b = 'asf';
        }
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
        constructor() {
            this.z = 1;
        }
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
        constructor() {
            this.one = 1;
        }
        foo() {
            assert(this.one === 1);
        }
        setVar() {
            this.var = 'bright';
        }
    }
    class Two {
        constructor() {
            this.two = 2;
        }
        bar() {
            assert(this.two === 2);
        }
        readVar() {
            assert(this.var === 'bright');
        }
    }
    class Three extends Two {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
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
    assert(f.one === 1 && f.two === 2 && f.three === 3);
    f.foo();
    f.bar();
    f.baz();
    f.yeah();
    f.setVar();
    f.readVar();
}
function test2() {
    class One {
        constructor(arg) {
            this.one = arg;
        }
        foo() {
            assert(this.one === 4);
        }
    }
    class Two {
        constructor(arg) {
            this.two = arg;
        }
        bar() {
            assert(this.two === 5);
        }
    }
    class Three extends Two {
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
        }
        yeah() {
            assert(this.one === 1 && this.two === 2 && this.three === 3);
            super.baz();
            super.foo();
        }
    }
    const f = new FooBar(4, 5, 6);
    assert(f.one === 4 && f.two === 5 && f.three === 6);
    f.foo();
    f.bar();
    f.baz();
    f.yeah();
}
function test3() {
    class One {
        constructor() {
            this.one = 1;
        }
        foo() {
            assert(this.one === 1);
        }
    }
    class Two {
        constructor() {
            this.two = 2;
        }
        bar() {
            assert(this.two == 2);
        }
    }
    class Three extends Two {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
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
        constructor() {
            this.lo = 'rem';
        }
    }
    {
        class Ipsum extends multiple(FooBar, Lorem) {
            constructor() {
                super(...arguments);
                this.ip = 'sum';
            }
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
            constructor() {
                super(...arguments);
                this.ip = 'sum';
            }
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
        constructor() {
            this.one = 1;
        }
        logOne() {
            assert(this.one === 1);
        }
    }
    class Two {
        constructor() {
            this.two = 2;
        }
        logTwo() {
            assert(this.two === 2);
        }
    }
    class Three extends multiple(One, Two) {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
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
        constructor() {
            this.four = 4;
        }
        logFour() {
            assert(this.four === 4);
        }
    }
    class Five {
        constructor() {
            this.five = 5;
        }
        logFive() {
            assert(this.five === 5);
        }
    }
    class Six extends multiple(Four, Five) {
        constructor() {
            super(...arguments);
            this.six = 6;
        }
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
        constructor() {
            this.one = 1;
        }
        logOne() {
            assert(this.one === 1);
        }
    }
    class Two {
        constructor() {
            this.two = 2;
        }
        logTwo() {
            assert(this.two === 2);
        }
    }
    class Three extends multiple(One, Two) {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
        logThree() {
            assert(this.one === 1);
            assert(this.two === 2);
            assert(this.three === 3);
        }
    }
    class Four {
        constructor() {
            this.four = 4;
        }
        logFour() {
            assert(this.four === 4);
        }
    }
    class Five {
        constructor() {
            this.five = 5;
        }
        logFive() {
            assert(this.five === 5);
        }
    }
    class Six extends multiple(Four, Five) {
        constructor() {
            super(...arguments);
            this.six = 6;
        }
        logSix() {
            assert(this.four === 4 && this.five === 5 && this.six === 6);
        }
        logSeven() {
            console.log(' --------- yeaaaaaaaaaaaaaaaaaaaaah');
        }
    }
    class Seven extends multiple(Three, Six) {
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
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
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
        logSeven() {
            assert(this.seven === 7, 'assert this.seven is 7');
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
        constructor() {
            this.two = 2;
        }
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
        constructor() {
            this.two = 2;
        }
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
    const three = new Three();
    three.method3();
    class Four {
    }
    class Five extends multiple(Four, Three) {
        constructor() {
            super();
            this.t = new Three();
            this.t.method3();
        }
        method5() {
            this.method3();
            this.t.method3();
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
    assert(count === 7, 'method2 should be called 7 times');
}
function testProxySpeed() {
    class One {
        constructor() {
            this.one = 1;
        }
        logOne() {
            this.one === 1;
        }
    }
    class Two {
        constructor() {
            this.two = 2;
        }
        logTwo() {
            this.two === 2;
        }
    }
    class Three extends multiple(One, Two) {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
        logThree() {
            this.one === 1;
            this.two === 2;
            this.three === 3;
        }
    }
    class Four {
        constructor() {
            this.four = 4;
        }
        logFour() {
            this.four === 4;
        }
    }
    class Five {
        constructor() {
            this.five = 5;
        }
        logFive() {
            this.five === 5;
        }
    }
    class Six extends multiple(Four, Five) {
        constructor() {
            super(...arguments);
            this.six = 6;
        }
        logSix() {
            this.four === 4 && this.five === 5 && this.six === 6;
        }
    }
    class Seven extends multiple(Three, Six) {
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
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
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
        logSeven() {
            this.seven === 7, 'assert this.seven is 7';
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
            constructor() {
                super(...arguments);
                this.one = 1;
            }
            logOne() {
                this.one === 1;
            }
        };
    }
    function TwoMixin(Base = Object) {
        return class Two extends Base {
            constructor() {
                super(...arguments);
                this.two = 2;
            }
            logTwo() {
                this.two === 2;
            }
        };
    }
    function ThreeMixin(Base = Object) {
        return class Three extends OneMixin(TwoMixin(Base)) {
            constructor() {
                super(...arguments);
                this.three = 3;
            }
            logThree() {
                this.one === 1;
                this.two === 2;
                this.three === 3;
            }
        };
    }
    function FourMixin(Base = Object) {
        return class Four extends Base {
            constructor() {
                super(...arguments);
                this.four = 4;
            }
            logFour() {
                this.four === 4;
            }
        };
    }
    function FiveMixin(Base = Object) {
        return class Five extends Base {
            constructor() {
                super(...arguments);
                this.five = 5;
            }
            logFive() {
                this.five === 5;
            }
        };
    }
    function SixMixin(Base = Object) {
        return class Six extends FourMixin(FiveMixin(Base)) {
            constructor() {
                super(...arguments);
                this.six = 6;
            }
            logSix() {
                this.four === 4 && this.five === 5 && this.six === 6;
            }
        };
    }
    class Seven extends ThreeMixin(SixMixin()) {
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
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
        constructor() {
            super(...arguments);
            this.seven = 7;
        }
        logSeven() {
            this.seven === 7, '.seven is 7';
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
            assert(this.three === 3);
        }
    }
    class Two {
        test2() {
            assert(this.three === 3);
        }
    }
    class Three extends multiple(One, Two) {
        constructor() {
            super(...arguments);
            this.three = 3;
        }
    }
    new Three().test1();
    new Three().test2();
}
//# sourceMappingURL=multiple.test.js.map