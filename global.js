var lowclass=function(t){var e={};function r(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},r.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);class o{constructor(){this.m=new WeakMap}set(t,e){this.m.set(t,e),this.m.set(e,t)}get(t){return this.m.get(t)}has(t){return this.m.has(t)}}const n={enumerable:!0,configurable:!0};function c(t,e,r,o=!1){r=u(o?l(t,e):Object.getOwnPropertyDescriptor(t,e),r),Object.defineProperty(t,e,r)}function i(t,e){let r,o;const n=Object.getOwnPropertyDescriptors(t);for(const t in e)r=e[t],o=n[t],e[t]=u(o,r);Object.defineProperties(t,e)}function u(t,e){if(("get"in e||"set"in e)&&("value"in e||"writable"in e))throw new TypeError("cannot specify both accessors and a value or writable attribute");return t&&("get"in e||"set"in e?(delete t.value,delete t.writable):("value"in e||"writable"in e)&&(delete t.get,delete t.set)),{...n,...t,...e}}function p(t,e,r=!0){let o,n=!1;return(o=1===arguments.length?t:r?l(t,e):Object.getOwnPropertyDescriptor(t,e))&&(o.get||o.set)&&(n=!0),n}function l(t,e){let r,o=t;for(;o;){if(r=Object.getOwnPropertyDescriptor(o,e))return r;o=o.__proto__}}r.d(e,"Class",function(){return P}),r.d(e,"createClassHelper",function(){return g}),r.d(e,"InvalidSuperAccessError",function(){return _}),r.d(e,"InvalidAccessError",function(){return w}),r.d(e,"staticBlacklist",function(){return s}),r.d(e,"version",function(){return C});const s=["subclass","extends",...Object.getOwnPropertyNames(new Function)],a=new WeakMap,f=new WeakMap,b=new o,y=new WeakMap,d={mode:"es5",nativeNaming:!1,prototypeWritable:!1,defaultClassDescriptor:{writable:!0,enumerable:!1,configurable:!0},setClassDescriptors:!0};class _ extends Error{}class w extends Error{}const P=g();e.default=P;function g(t){(t=t?{...d,...t}:d).defaultClassDescriptor={...d.defaultClassDescriptor,...t.defaultClassDescriptor};const{mode:e,prototypeWritable:r,setClassDescriptors:n,nativeNaming:u}=t;return function(...t){let e=!1;if("function"==typeof this&&(e=!0),t.length<=2){let r="",o=null;"string"==typeof t[0]?r=t[0]:"function"!=typeof t[0]&&"object"!=typeof t[0]||(o=t[0]),"function"!=typeof t[1]&&"object"!=typeof t[1]||(o=t[1]);const n=e?p.call(this,r,o):p(r,o);return n.extends=function(t,e){return e=e||o,p.call(t,r,e)},n}throw new TypeError("invalid args")};function p(p,l){let y=this;if("string"!=typeof p)throw new TypeError("\n                You must specify a string for the 'className' argument.\n            ");let d=null;if(l&&"object"==typeof l)d=l;else if(!y&&(!l||"function"!=typeof l&&"object"!=typeof l)){let t;return u&&p?t=new Function(`return function ${p}() {}`)():(t=function(){},p&&c(t,"name",{value:p})),t.prototype={__proto__:Object.prototype,constructor:t},c(t,"subclass",{value:P,writable:!0,enumerable:!1,configurable:!1}),t}const g={publicToPrivate:new o},C=new WeakMap,x=function(t,e,r){const{publicPrototype:o,protectedPrototype:n,privatePrototype:c,parentPublicPrototype:i,parentProtectedPrototype:u,parentPrivatePrototype:p}=e;if(j(r,o))return D(r,i,t);if(j(r,n))return D(r,u,t);if(j(r,c))return D(r,p,t);throw new _("invalid super access")}.bind(null,C,g),E=function(t,e){return j(e,t.privatePrototype)?v(e).publicToPrivate.get(e):j(e,t.protectedPrototype)?b.get(e):e}.bind(null,g),M=function(t,e){if(j(e,t.publicPrototype))return b.get(e)||O(e);if(j(e,t.privatePrototype)){const t=v(e).publicToPrivate.get(e);return b.get(t)||O(t)}if(j(e,t.protectedPrototype))return e;throw new w("invalid access of protected member")}.bind(null,g),W=function(t,e){if(j(e,t.publicPrototype))return t.publicToPrivate.get(e)||h(t,e);if(j(e,t.protectedPrototype)){const r=b.get(e);return t.publicToPrivate.get(r)||h(t,r)}if(j(e,t.privatePrototype))return e;throw new w("invalid access of private member")}.bind(null,g);if(E.prototype={},M.prototype={},W.prototype={},E.Public=E,E.Protected=M,E.Private=W,E.Super=x,M.Public=E,M.Protected=M,M.Private=W,M.Super=x,(d=d||l&&l(E,M,W,x))&&"object"!=typeof d&&"function"!=typeof d)throw new TypeError("\n                The return value of a class definer function, if any, should be\n                an object, or a class constructor.\n            ");let k,N=null;"function"==typeof d&&(N=d,d=d.prototype,y=N.prototype.__proto__.constructor),d&&(k=d.static,delete d.static,"function"==typeof d.public&&(d.public=d.public(M,W)),"function"==typeof d.protected&&(d.protected=d.protected(E,W)),"function"==typeof d.private&&(d.private=d.private(E,M)));const S=(y=y||Object).prototype,A=d&&d.public||d||Object.create(S);A.__proto__!==S&&(A.__proto__=S);const F=a.get(S)||{},$=d&&d.protected||Object.create(F);$.__proto__!==F&&($.__proto__=F),a.set(A,$);const I=f.get(S)||{},B=d&&d.private||Object.create(I);if(B.__proto__!==I&&(B.__proto__=I),f.set(A,B),g.publicPrototype=A,g.privatePrototype=B,g.protectedPrototype=$,g.parentPublicPrototype=S,g.parentProtectedPrototype=F,g.parentPrivatePrototype=I,m(E.prototype,A),m(M.prototype,$),m(W.prototype,B),d&&(delete d.public,delete d.protected,delete d.private,d!==A&&m(d,A)),N)return k&&m(k,N),N;const H=A.hasOwnProperty("constructor")?A.constructor:null;let Y=null,q=null;if("es5"!==e)throw new TypeError("\n                The lowclass mode option can only be 'es5' for now.\n            ");if(Y=(()=>(function(){let t=null,e=null;if((e=H||y)!==Object&&(t=e.apply(this,arguments)),t&&"object"==typeof t)return t}))(),q=A,p)if(u){const t=function(t){const e=t.toString().split("\n");return e.shift(),e.pop(),e.join("\n")}(Y),e=Y.prototype;(Y=new Function(" userConstructor, ParentClass ",`\n                    return function ${p}() { ${t} }\n                `)(H,y)).prototype=e}else c(Y,"name",{value:p});return H&&H.length&&c(Y,"length",{value:H.length}),Y.__proto__=y,k&&m(k,Y),c(Y,"subclass",{value:P,writable:!0,enumerable:!1,configurable:!1}),Y.prototype=q,Y.prototype.constructor=Y,n&&(!function(t,{defaultClassDescriptor:{writable:e,enumerable:r,configurable:o}}){const n=Object.getOwnPropertyDescriptors(t);let c;for(const t in n)s.includes(t)?delete n[t]:(("value"in(c=n[t])||"writable"in c)&&(c.writable=e),c.enumerable=r,c.configurable=o);i(t,n)}(Y,t),c(Y,"prototype",{writable:r}),T(Y.prototype,t),T($,t),T(B,t)),Y}}function v(t){return y.get(t)}function O(t){const e=function(t){let e=null,r=t.__proto__;for(;r;){if(e=a.get(r))return e;r=r.__proto__}return e}(t),r=Object.create(e);return b.set(t,r),r}function h(t,e){const r=Object.create(t.privatePrototype);return t.publicToPrivate.set(e,r),y.set(r,t),r}function j(t,e){let r=t.__proto__;do{if(e===r)return!0;r=r.__proto__}while(r);return!1}function m(t,e,r){const o=Object.getOwnPropertyNames(t);let n=o.length;for(;n--;){const c=o[n],i=Object.getOwnPropertyDescriptor(t,c);r&&r(i),Object.defineProperty(e,c,i)}}function D(t,e,r){let o=r.get(t);if(!o){r.set(t,o=Object.create(e));const n=function(t){let e=t,r=[];for(;e;)r=r.concat(Object.getOwnPropertyNames(e)),e=e.__proto__;return r=Array.from(new Set(r))}(e);let i=n.length;for(;i--;){const r=n[i];c(o,r,{get:function(){let o=void 0;const n=l(e,r);if(n&&p(n)){const e=n.get;e&&(o=e.call(t))}else o=e[r];return o&&o.call&&"function"==typeof o&&(o=o.bind(t)),o},set:function(o){const n=l(e,r);if(n&&p(n)){const e=n.set;e&&(o=e.call(t,o))}else t[r]=o}},!0)}}return o}function T(t,{defaultClassDescriptor:{writable:e,enumerable:r,configurable:o}}){const n=Object.getOwnPropertyDescriptors(t);let c;for(const t in n)("value"in(c=n[t])||"writable"in c)&&(c.writable=e),c.enumerable=r,c.configurable=o;i(t,n)}const C="4.0.2"}]);
//# sourceMappingURL=global.js.map