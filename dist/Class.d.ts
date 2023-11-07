import { Constructor } from './utils.js';
import type { Id } from './types.js';
type ImplementationKeys = 'static' | 'private' | 'protected';
type FunctionToConstructor<T, TReturn> = T extends (...a: infer A) => void ? new (...a: A) => TReturn : never;
type ReplaceCtorReturn<T, TReturn> = T extends new (...a: infer A) => unknown ? new (...a: A) => TReturn : never;
type ConstructorOrDefault<T> = T extends {
    constructor: infer TCtor;
} ? TCtor : () => void;
type SuperType<_T, TSuper extends Constructor<any>> = TSuper extends Constructor<infer I, infer A> ? {
    constructor: (...a: A) => I;
} & InstanceType<TSuper> : never;
type SuperHelper<TSuper extends Constructor> = <T>(self: T) => SuperType<T, TSuper>;
type PrivateHelper = <T>(self: T) => T extends {
    __: {
        private: infer TPrivate;
    };
} ? TPrivate : never;
type PublicHelper = <T>(self: T) => Omit<T, ImplementationKeys>;
type ProtectedHelper = <T>(self: T) => T extends {
    __: {
        protected: infer TProtected;
    };
} ? TProtected : never;
type Statics<T> = T extends {
    static: infer TStatic;
} ? TStatic : {};
type SaveInheritedProtected<T> = T extends {
    protected: infer TProtected;
} ? TProtected : {};
type StaticsAndProtected<T> = Id<Statics<T> & {
    __: {
        protected: SaveInheritedProtected<T>;
    };
}>;
type ExtractInheritedProtected<T> = T extends {
    __: infer TProtected;
} ? TProtected : {};
type PickImplementationKeys<T> = Pick<T, Extract<keyof T, ImplementationKeys>>;
type LowClassThis<T> = Id<Omit<T, ImplementationKeys> & {
    __: PickImplementationKeys<T>;
}>;
type OmitImplementationKeys<T> = Omit<T, ImplementationKeys>;
export declare const staticBlacklist: string[];
export declare class InvalidSuperAccessError extends Error {
}
export declare class InvalidAccessError extends Error {
}
export declare const Class: {
    (): typeof Object;
    (name: string): {
        extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
            Super: SuperHelper<TBase>;
            Public: PublicHelper;
            Protected: ProtectedHelper;
            Private: PrivateHelper;
        }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        } extends infer T_1 ? { [P in keyof T_1]: (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })[P]; } : never>, brand?: object): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, InstanceType<TBase> & OmitImplementationKeys<T> extends infer T_2 ? { [P_1 in keyof T_2]: (InstanceType<TBase> & OmitImplementationKeys<T>)[P_1]; } : never> & ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_4 ? { [P_3 in keyof T_4]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_3]; } : never) & Pick<TBase, keyof TBase> extends infer T_3 ? { [P_2 in keyof T_3]: ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_4 ? { [P_3 in keyof T_4]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_3]; } : never) & Pick<TBase, keyof TBase>)[P_2]; } : never) : ReplaceCtorReturn<TBase, InstanceType<TBase> extends infer T_5 ? { [P_4 in keyof T_5]: InstanceType<TBase>[P_4]; } : never> & ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_7 ? { [P_6 in keyof T_7]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_6]; } : never) & Pick<TBase, keyof TBase> extends infer T_6 ? { [P_5 in keyof T_6]: ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_7 ? { [P_6 in keyof T_7]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_6]; } : never) & Pick<TBase, keyof TBase>)[P_5]; } : never);
    };
    <T_8>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T_8 & ThisType<Omit<T_8, ImplementationKeys> & {
        __: PickImplementationKeys<T_8>;
    } extends infer T_9 ? { [P_7 in keyof T_9]: (Omit<T_8, ImplementationKeys> & {
        __: PickImplementationKeys<T_8>;
    })[P_7]; } : never>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T_8>, OmitImplementationKeys<T_8> extends infer T_10 ? { [P_8 in keyof T_10]: OmitImplementationKeys<T_8>[P_8]; } : never> & ((Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    } extends infer T_12 ? { [P_10 in keyof T_12]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    })[P_10]; } : never) extends infer T_11 ? { [P_9 in keyof T_11]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    } extends infer T_12 ? { [P_10 in keyof T_12]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    })[P_10]; } : never)[P_9]; } : never);
    <T_13>(name: string, members: T_13 & ThisType<Omit<T_13, ImplementationKeys> & {
        __: PickImplementationKeys<T_13>;
    } extends infer T_14 ? { [P_11 in keyof T_14]: (Omit<T_13, ImplementationKeys> & {
        __: PickImplementationKeys<T_13>;
    })[P_11]; } : never>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T_13>, OmitImplementationKeys<T_13> extends infer T_15 ? { [P_12 in keyof T_15]: OmitImplementationKeys<T_13>[P_12]; } : never> & ((Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    } extends infer T_17 ? { [P_14 in keyof T_17]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    })[P_14]; } : never) extends infer T_16 ? { [P_13 in keyof T_16]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    } extends infer T_17 ? { [P_14 in keyof T_17]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    })[P_14]; } : never)[P_13]; } : never);
};
export declare function createClassHelper(options?: any): {
    (): typeof Object;
    (name: string): {
        extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
            Super: SuperHelper<TBase>;
            Public: PublicHelper;
            Protected: ProtectedHelper;
            Private: PrivateHelper;
        }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        } extends infer T_1 ? { [P in keyof T_1]: (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })[P]; } : never>, brand?: object): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, InstanceType<TBase> & OmitImplementationKeys<T> extends infer T_2 ? { [P_1 in keyof T_2]: (InstanceType<TBase> & OmitImplementationKeys<T>)[P_1]; } : never> & ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_4 ? { [P_3 in keyof T_4]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_3]; } : never) & Pick<TBase, keyof TBase> extends infer T_3 ? { [P_2 in keyof T_3]: ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_4 ? { [P_3 in keyof T_4]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_3]; } : never) & Pick<TBase, keyof TBase>)[P_2]; } : never) : ReplaceCtorReturn<TBase, InstanceType<TBase> extends infer T_5 ? { [P_4 in keyof T_5]: InstanceType<TBase>[P_4]; } : never> & ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_7 ? { [P_6 in keyof T_7]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_6]; } : never) & Pick<TBase, keyof TBase> extends infer T_6 ? { [P_5 in keyof T_6]: ((Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        } extends infer T_7 ? { [P_6 in keyof T_7]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_6]; } : never) & Pick<TBase, keyof TBase>)[P_5]; } : never);
    };
    <T_8>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T_8 & ThisType<Omit<T_8, ImplementationKeys> & {
        __: PickImplementationKeys<T_8>;
    } extends infer T_9 ? { [P_7 in keyof T_9]: (Omit<T_8, ImplementationKeys> & {
        __: PickImplementationKeys<T_8>;
    })[P_7]; } : never>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T_8>, OmitImplementationKeys<T_8> extends infer T_10 ? { [P_8 in keyof T_10]: OmitImplementationKeys<T_8>[P_8]; } : never> & ((Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    } extends infer T_12 ? { [P_10 in keyof T_12]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    })[P_10]; } : never) extends infer T_11 ? { [P_9 in keyof T_11]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    } extends infer T_12 ? { [P_10 in keyof T_12]: (Statics<T_8> & {
        __: {
            protected: SaveInheritedProtected<T_8>;
        };
    })[P_10]; } : never)[P_9]; } : never);
    <T_13>(name: string, members: T_13 & ThisType<Omit<T_13, ImplementationKeys> & {
        __: PickImplementationKeys<T_13>;
    } extends infer T_14 ? { [P_11 in keyof T_14]: (Omit<T_13, ImplementationKeys> & {
        __: PickImplementationKeys<T_13>;
    })[P_11]; } : never>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T_13>, OmitImplementationKeys<T_13> extends infer T_15 ? { [P_12 in keyof T_15]: OmitImplementationKeys<T_13>[P_12]; } : never> & ((Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    } extends infer T_17 ? { [P_14 in keyof T_17]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    })[P_14]; } : never) extends infer T_16 ? { [P_13 in keyof T_16]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    } extends infer T_17 ? { [P_14 in keyof T_17]: (Statics<T_13> & {
        __: {
            protected: SaveInheritedProtected<T_13>;
        };
    })[P_14]; } : never)[P_13]; } : never);
};
export default Class;
//# sourceMappingURL=Class.d.ts.map