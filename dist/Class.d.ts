import { Constructor } from './utils.js';
import type { Id } from './types.js';
declare type ImplementationKeys = 'static' | 'private' | 'protected';
declare type FunctionToConstructor<T, TReturn> = T extends (...a: infer A) => void ? new (...a: A) => TReturn : never;
declare type ReplaceCtorReturn<T, TReturn> = T extends new (...a: infer A) => unknown ? new (...a: A) => TReturn : never;
declare type ConstructorOrDefault<T> = T extends {
    constructor: infer TCtor;
} ? TCtor : () => void;
declare type SuperType<_T, TSuper extends Constructor<any>> = TSuper extends Constructor<infer I, infer A> ? {
    constructor: (...a: A) => I;
} & InstanceType<TSuper> : never;
declare type SuperHelper<TSuper extends Constructor> = <T>(self: T) => SuperType<T, TSuper>;
declare type PrivateHelper = <T>(self: T) => T extends {
    __: {
        private: infer TPrivate;
    };
} ? TPrivate : never;
declare type PublicHelper = <T>(self: T) => Omit<T, ImplementationKeys>;
declare type ProtectedHelper = <T>(self: T) => T extends {
    __: {
        protected: infer TProtected;
    };
} ? TProtected : never;
declare type Statics<T> = T extends {
    static: infer TStatic;
} ? TStatic : {};
declare type SaveInheritedProtected<T> = T extends {
    protected: infer TProtected;
} ? TProtected : {};
declare type StaticsAndProtected<T> = Id<Statics<T> & {
    __: {
        protected: SaveInheritedProtected<T>;
    };
}>;
declare type ExtractInheritedProtected<T> = T extends {
    __: infer TProtected;
} ? TProtected : {};
declare type PickImplementationKeys<T> = Pick<T, Extract<keyof T, ImplementationKeys>>;
declare type LowClassThis<T> = Id<Omit<T, ImplementationKeys> & {
    __: PickImplementationKeys<T>;
}>;
declare type OmitImplementationKeys<T> = Omit<T, ImplementationKeys>;
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
        }) => T & Partial<InstanceType<TBase>> & ThisType<{ [P in keyof (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })]: (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })[P]; }>, brand?: object | undefined): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, { [P_1 in keyof (InstanceType<TBase> & OmitImplementationKeys<T>)]: (InstanceType<TBase> & OmitImplementationKeys<T>)[P_1]; }> & { [P_3 in keyof ({ [P_2 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_2]; } & Pick<TBase, keyof TBase>)]: ({ [P_2 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_2]; } & Pick<TBase, keyof TBase>)[P_3]; } : ReplaceCtorReturn<TBase, { [P_4 in keyof InstanceType<TBase>]: InstanceType<TBase>[P_4]; }> & { [P_6 in keyof ({ [P_5 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_5]; } & Pick<TBase, keyof TBase>)]: ({ [P_5 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_5]; } & Pick<TBase, keyof TBase>)[P_6]; };
    };
    <T_1>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T_1 & ThisType<{ [P_7 in keyof (Omit<T_1, ImplementationKeys> & {
        __: PickImplementationKeys<T_1>;
    })]: (Omit<T_1, ImplementationKeys> & {
        __: PickImplementationKeys<T_1>;
    })[P_7]; }>, brand?: object | undefined): FunctionToConstructor<ConstructorOrDefault<T_1>, { [P_8 in keyof OmitImplementationKeys<T_1>]: OmitImplementationKeys<T_1>[P_8]; }> & { [P_10 in keyof { [P_9 in keyof (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })]: (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })[P_9]; }]: { [P_9 in keyof (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })]: (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })[P_9]; }[P_10]; };
    <T_2>(name: string, members: T_2 & ThisType<{ [P_11 in keyof (Omit<T_2, ImplementationKeys> & {
        __: PickImplementationKeys<T_2>;
    })]: (Omit<T_2, ImplementationKeys> & {
        __: PickImplementationKeys<T_2>;
    })[P_11]; }>, brand?: object | undefined): FunctionToConstructor<ConstructorOrDefault<T_2>, { [P_12 in keyof OmitImplementationKeys<T_2>]: OmitImplementationKeys<T_2>[P_12]; }> & { [P_14 in keyof { [P_13 in keyof (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })]: (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })[P_13]; }]: { [P_13 in keyof (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })]: (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })[P_13]; }[P_14]; };
};
export declare function createClassHelper(options?: any): {
    (): typeof Object;
    (name: string): {
        extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
            Super: SuperHelper<TBase>;
            Public: PublicHelper;
            Protected: ProtectedHelper;
            Private: PrivateHelper;
        }) => T & Partial<InstanceType<TBase>> & ThisType<{ [P in keyof (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })]: (Omit<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>, ImplementationKeys> & {
            __: PickImplementationKeys<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>;
        })[P]; }>, brand?: object | undefined): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, { [P_1 in keyof (InstanceType<TBase> & OmitImplementationKeys<T>)]: (InstanceType<TBase> & OmitImplementationKeys<T>)[P_1]; }> & { [P_3 in keyof ({ [P_2 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_2]; } & Pick<TBase, keyof TBase>)]: ({ [P_2 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_2]; } & Pick<TBase, keyof TBase>)[P_3]; } : ReplaceCtorReturn<TBase, { [P_4 in keyof InstanceType<TBase>]: InstanceType<TBase>[P_4]; }> & { [P_6 in keyof ({ [P_5 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_5]; } & Pick<TBase, keyof TBase>)]: ({ [P_5 in keyof (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })]: (Statics<T> & {
            __: {
                protected: SaveInheritedProtected<T>;
            };
        })[P_5]; } & Pick<TBase, keyof TBase>)[P_6]; };
    };
    <T_1>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T_1 & ThisType<{ [P_7 in keyof (Omit<T_1, ImplementationKeys> & {
        __: PickImplementationKeys<T_1>;
    })]: (Omit<T_1, ImplementationKeys> & {
        __: PickImplementationKeys<T_1>;
    })[P_7]; }>, brand?: object | undefined): FunctionToConstructor<ConstructorOrDefault<T_1>, { [P_8 in keyof OmitImplementationKeys<T_1>]: OmitImplementationKeys<T_1>[P_8]; }> & { [P_10 in keyof { [P_9 in keyof (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })]: (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })[P_9]; }]: { [P_9 in keyof (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })]: (Statics<T_1> & {
        __: {
            protected: SaveInheritedProtected<T_1>;
        };
    })[P_9]; }[P_10]; };
    <T_2>(name: string, members: T_2 & ThisType<{ [P_11 in keyof (Omit<T_2, ImplementationKeys> & {
        __: PickImplementationKeys<T_2>;
    })]: (Omit<T_2, ImplementationKeys> & {
        __: PickImplementationKeys<T_2>;
    })[P_11]; }>, brand?: object | undefined): FunctionToConstructor<ConstructorOrDefault<T_2>, { [P_12 in keyof OmitImplementationKeys<T_2>]: OmitImplementationKeys<T_2>[P_12]; }> & { [P_14 in keyof { [P_13 in keyof (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })]: (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })[P_13]; }]: { [P_13 in keyof (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })]: (Statics<T_2> & {
        __: {
            protected: SaveInheritedProtected<T_2>;
        };
    })[P_13]; }[P_14]; };
};
export default Class;
//# sourceMappingURL=Class.d.ts.map