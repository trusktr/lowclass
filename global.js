var lowclass=function(t){var e={};function r(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,o){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(o,n,function(e){return t[e]}.bind(null,n));return o},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);class o{constructor(){this.m=new WeakMap}set(t,e){this.m.set(t,e),this.m.set(e,t)}get(t){return this.m.get(t)}has(t){return this.m.has(t)}}const n={enumerable:!0,configurable:!0};function c(t,e,r,o=!1){r=u(o?p(t,e):Object.getOwnPropertyDescriptor(t,e),r),Object.defineProperty(t,e,r)}function i(t,e){let r,o;const n=Object.getOwnPropertyDescriptors(t);for(const t in e)r=e[t],o=n[t],e[t]=u(o,r);Object.defineProperties(t,e)}function u(t,e){if(("get"in e||"set"in e)&&("value"in e||"writable"in e))throw new TypeError("cannot specify both accessors and a value or writable attribute");return t&&("get"in e||"set"in e?(delete t.value,delete t.writable):("value"in e||"writable"in e)&&(delete t.get,delete t.set)),{...n,...t,...e}}function l(t,e,r=!0){let o,n=!1;return(o=1===arguments.length?t:r?p(t,e):Object.getOwnPropertyDescriptor(t,e))&&(o.get||o.set)&&(n=!0),n}function p(t,e){let r,o=t;for(;o;){if(r=Object.getOwnPropertyDescriptor(o,e))return r.owner=o,r;o=o.__proto__}}r.d(e,"Class",function(){return P}),r.d(e,"createClassHelper",function(){return w}),r.d(e,"InvalidSuperAccessError",function(){return _}),r.d(e,"InvalidAccessError",function(){return g}),r.d(e,"staticBlacklist",function(){return s}),r.d(e,"version",function(){return C});const s=["subclass","extends",...Object.getOwnPropertyNames(new Function)],a=new WeakMap,f=new WeakMap,b=new o,y=new WeakMap,d={mode:"es5",nativeNaming:!1,prototypeWritable:!1,defaultClassDescriptor:{writable:!0,enumerable:!1,configurable:!0},setClassDescriptors:!0};class _ extends Error{}class g extends Error{}const P=w();e.default=P;function w(t){(t=t?{...d,...t}:d).defaultClassDescriptor={...d.defaultClassDescriptor,...t.defaultClassDescriptor};const{mode:e,prototypeWritable:r,setClassDescriptors:n,nativeNaming:u}=t;return function(...t){let e=!1;if("function"==typeof this&&(e=!0),t.length<=2){let r="",o=null;"string"==typeof t[0]?r=t[0]:"function"!=typeof t[0]&&"object"!=typeof t[0]||(o=t[0]),"function"!=typeof t[1]&&"object"!=typeof t[1]||(o=t[1]);const n=e?l.call(this,r,o):l(r,o);return n.extends=function(t,e){return e=e||o,l.call(t,r,e)},n}throw new TypeError("invalid args")};function l(l,p){let y=this;if("string"!=typeof l)throw new TypeError("\n                You must specify a string for the 'className' argument.\n            ");let d=null;if(p&&"object"==typeof p)d=p;else if(!y&&(!p||"function"!=typeof p&&"object"!=typeof p)){let t;return u&&l?t=new Function(`return function ${l}() {}`)():(t=function(){},l&&c(t,"name",{value:l})),t.prototype={__proto__:Object.prototype,constructor:t},c(t,"subclass",{value:P,writable:!0,enumerable:!1,configurable:!1}),t}const w={publicToPrivate:new o},C=new WeakMap,S=function(t,e,r){const{publicPrototype:o,protectedPrototype:n,privatePrototype:c,parentPublicPrototype:i,parentProtectedPrototype:u,parentPrivatePrototype:l}=e;if(m(r,o))return D(r,i,t);if(m(r,n))return D(r,u,t);if(m(r,c))return D(r,l,t);throw new _("invalid super access")}.bind(null,C,w),x=function(t,e){return m(e,t.privatePrototype)?v(e).publicToPrivate.get(e):m(e,t.protectedPrototype)?b.get(e):e}.bind(null,w),E=function(t,e){if(m(e,t.publicPrototype))return b.get(e)||O(e);if(m(e,t.privatePrototype)){const t=v(e).publicToPrivate.get(e);return b.get(t)||O(t)}if(m(e,t.protectedPrototype))return e;throw new g("invalid access of protected member")}.bind(null,w),M=function(t,e){if(m(e,t.publicPrototype))return t.publicToPrivate.get(e)||j(t,e);if(m(e,t.protectedPrototype)){const r=b.get(e);return t.publicToPrivate.get(r)||j(t,r)}if(m(e,t.privatePrototype))return e;throw new g("invalid access of private member")}.bind(null,w);if(x.prototype={},E.prototype={},M.prototype={},x.Public=x,x.Protected=E,x.Private=M,x.Super=S,E.Public=x,E.Protected=E,E.Private=M,E.Super=S,(d=d||p&&p(x,E,M,S))&&"object"!=typeof d&&"function"!=typeof d)throw new TypeError("\n                The return value of a class definer function, if any, should be\n                an object, or a class constructor.\n            ");let W,k=null;"function"==typeof d&&(k=d,d=d.prototype,y=k.prototype.__proto__.constructor),d&&(W=d.static,delete d.static,"function"==typeof d.public&&(d.public=d.public(E,M)),"function"==typeof d.protected&&(d.protected=d.protected(x,M)),"function"==typeof d.private&&(d.private=d.private(x,E)));const N=(y=y||Object).prototype,A=d&&d.public||d||Object.create(N);A.__proto__!==N&&(A.__proto__=N);const F=a.get(N)||{},$=d&&d.protected||Object.create(F);$.__proto__!==F&&($.__proto__=F),a.set(A,$);const I=f.get(N)||{},B=d&&d.private||Object.create(I);if(B.__proto__!==I&&(B.__proto__=I),f.set(A,B),w.publicPrototype=A,w.privatePrototype=B,w.protectedPrototype=$,w.parentPublicPrototype=N,w.parentProtectedPrototype=F,w.parentPrivatePrototype=I,h(x.prototype,A),h(E.prototype,$),h(M.prototype,B),d&&(delete d.public,delete d.protected,delete d.private,d!==A&&h(d,A)),k)return W&&h(W,k),k;const H=A.hasOwnProperty("constructor")?A.constructor:null;let Y=null,q=null;if("es5"!==e)throw new TypeError("\n                The lowclass mode option can only be 'es5' for now.\n            ");if(Y=function(){let t=null,e=null;if((e=H||y)!==Object&&(t=e.apply(this,arguments)),t&&"object"==typeof t)return t},q=A,l)if(u){const t=function(t){const e=t.toString().split("\n");return e.shift(),e.pop(),e.join("\n")}(Y),e=Y.prototype;(Y=new Function(" userConstructor, ParentClass ",`\n                    return function ${l}() { ${t} }\n                `)(H,y)).prototype=e}else c(Y,"name",{value:l});return H&&H.length&&c(Y,"length",{value:H.length}),Y.__proto__=y,W&&h(W,Y),c(Y,"subclass",{value:P,writable:!0,enumerable:!1,configurable:!1}),Y.prototype=q,Y.prototype.constructor=Y,n&&(!function(t,{defaultClassDescriptor:{writable:e,enumerable:r,configurable:o}}){const n=Object.getOwnPropertyDescriptors(t);let c;for(const t in n)s.includes(t)?delete n[t]:(("value"in(c=n[t])||"writable"in c)&&(c.writable=e),c.enumerable=r,c.configurable=o);i(t,n)}(Y,t),c(Y,"prototype",{writable:r}),T(Y.prototype,t),T($,t),T(B,t)),Y}}function v(t){return y.get(t)}function O(t){const e=function(t){let e=null,r=t.__proto__;for(;r;){if(e=a.get(r))return e;r=r.__proto__}return e}(t),r=Object.create(e);return b.set(t,r),r}function j(t,e){const r=Object.create(t.privatePrototype);return t.publicToPrivate.set(e,r),y.set(r,t),r}function m(t,e){let r=t.__proto__;do{if(e===r)return!0;r=r.__proto__}while(r);return!1}function h(t,e,r){const o=Object.getOwnPropertyNames(t);let n=o.length;for(;n--;){const c=o[n],i=Object.getOwnPropertyDescriptor(t,c);r&&r(i),Object.defineProperty(e,c,i)}}function D(t,e,r){let o=r.get(t);if(!o){r.set(t,o=Object.create(e));const n=function(t){let e=t,r=[];for(;e;)r=r.concat(Object.getOwnPropertyNames(e)),e=e.__proto__;return r=Array.from(new Set(r))}(e);let i=n.length;for(;i--;){const r=n[i];c(o,r,{get:function(){let o=void 0;const n=p(e,r);if(n&&l(n)){const e=n.get;e&&(o=e.call(t))}else o=e[r];return o&&o.call&&"function"==typeof o&&(o=o.bind(t)),o},set:function(o){const n=p(e,r);if(n&&l(n)){const e=n.set;e&&(o=e.call(t,o))}else t[r]=o}},!0)}}return o}function T(t,{defaultClassDescriptor:{writable:e,enumerable:r,configurable:o}}){const n=Object.getOwnPropertyDescriptors(t);let c;for(const t in n)("value"in(c=n[t])||"writable"in c)&&(c.writable=e),c.enumerable=r,c.configurable=o;i(t,n)}const C="4.2.1"}]);
//# sourceMappingURL=global.js.map