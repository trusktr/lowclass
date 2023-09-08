import Class from '../index.js';
import { native } from '../native.js';
describe('Custom Elements', () => {
    it('works with custom elements', () => {
        {
            const MyEL = Class().extends(native(HTMLElement), ({ Super }) => ({
                static: {
                    observedAttributes: ['foo'],
                },
                connected: false,
                disconnected: true,
                constructor() {
                    return Super(this).constructor();
                },
                connectedCallback() {
                    this.connected = true;
                    this.disconnected = false;
                },
                disconnectedCallback() {
                    this.connected = false;
                    this.disconnected = true;
                },
                attributeChangedCallback(attr, oldVal, newVal) {
                    this[attr] = newVal;
                },
            }));
            customElements.define('my-el', MyEL);
            const el = document.createElement('my-el');
            document.body.appendChild(el);
            expect(el.connected).toBe(true);
            expect(el.disconnected).toBe(false);
            el.setAttribute('foo', 'bar');
            expect(el.foo).toBe('bar');
            document.body.removeChild(el);
            expect(el.connected).toBe(false);
            expect(el.disconnected).toBe(true);
        }
        {
            const MyEl = Class().extends(window.HTMLElement, ({ Super }) => ({
                constructor() {
                    return Reflect.construct(Super(this).constructor, [], this.constructor);
                },
                connectedCallback() {
                    this.connected = true;
                },
            }));
            customElements.define('my-el1', MyEl);
            const el = new MyEl();
            document.body.appendChild(el);
            expect(el.connected).toBe(true);
            document.body.removeChild(el);
        }
        {
            const MyEl = Class().extends(native(HTMLElement), {
                constructor() {
                    return super.constructor();
                },
                connectedCallback() {
                    this.connected = true;
                },
            });
            const MyEl2 = Class().extends(MyEl, {
                constructor() {
                    return super.constructor();
                },
                connectedCallback() {
                    super.connectedCallback();
                },
            });
            customElements.define('my-el2', MyEl2);
            const el = document.createElement('my-el2');
            expect(el instanceof MyEl2).toBe(true);
            document.body.appendChild(el);
            expect(el.connected).toBe(true);
            document.body.removeChild(el);
        }
        {
            const MyEl = Class().extends(native(HTMLElement), {
                constructor() {
                    return Reflect.construct(super.constructor, [], this.constructor);
                },
                connectedCallback() {
                    this.connected = true;
                },
            });
            const MyEl2 = Class().extends(MyEl, {
                constructor() {
                    return Reflect.construct(super.constructor, [], this.constructor);
                },
                connectedCallback() {
                    super.connectedCallback();
                },
            });
            customElements.define('my-el3', MyEl2);
            const el = document.createElement('my-el3');
            expect(el instanceof MyEl2).toBe(true);
            document.body.appendChild(el);
            expect(el.connected).toBe(true);
            document.body.removeChild(el);
        }
        {
            const MyEl = Class(({ Protected }) => class extends HTMLElement {
                constructor() {
                    return Reflect.construct(HTMLElement, [], new.target);
                }
                connectedCallback() {
                    Protected(this).connected = true;
                }
                getProtectedMember() {
                    return Protected(this).connected;
                }
                static protected() {
                    return {
                        connected: false,
                    };
                }
            });
            const MyEl2 = Class(({ Protected }) => class extends MyEl {
                constructor() {
                    return Reflect.construct(MyEl, [], new.target);
                }
                connectedCallback() {
                    super.connectedCallback();
                }
            });
            customElements.define('my-el6', MyEl2);
            const el = document.createElement('my-el6');
            expect(el instanceof MyEl2).toBe(true);
            document.body.appendChild(el);
            expect(el.connected).toBe(undefined);
            expect(el.getProtectedMember()).toBe(true);
            document.body.removeChild(el);
        }
    });
});
//# sourceMappingURL=custom-elements.test.js.map