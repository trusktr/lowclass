export const Counter: {
    extends<TBase extends import("../Constructor.js").Constructor, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A extends any[]) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_1>(self: T_1) => Omit<T_1, "static" | "private" | "protected">;
        Protected: <T_1>(self: T_1) => T_1 extends {
            __: {
                protected: infer TProtected;
            };
        } ? TProtected : never;
        Private: <T_1>(self: T_1) => T_1 extends {
            __: {
                private: infer TPrivate;
            };
        } ? TPrivate : never;
    }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected;
    } ? TProtected : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}), "static" | "private" | "protected"> extends infer T_2 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {})) ? { [P_1 in T_2]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}))[P_1]; } : never;
    } extends infer T_1 ? { [P in keyof T_1]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected;
    } ? TProtected : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}), "static" | "private" | "protected"> extends infer T_2 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {})) ? { [P_1 in T_2]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}))[P_1]; } : never;
    })[P]; } : never>, brand?: object): T extends {
        constructor: infer _TCtor;
    } ? ((T extends infer T_1 ? T_1 extends T ? T_1 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) extends infer T_3 ? T_3 extends (T extends infer T_1 ? T_1 extends T ? T_1 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) ? T_3 extends (...a: infer A) => void ? new (...a: A) => InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_2 extends keyof T ? { [P in T_2]: T[P]; } : never) extends infer T_4 ? { [P_1 in keyof T_4]: (InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_2 extends keyof T ? { [P in T_2]: T[P]; } : never))[P_1]; } : never : never : never : never) & import("../types.js").Id<((T extends infer T_5 ? T_5 extends T ? T_5 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_6 ? T_6 extends T ? T_6 extends {
                protected: infer TProtected;
            } ? TProtected : {} : never : never;
        };
    } extends infer T_4 ? { [P_1 in keyof T_4]: ((T extends infer T_5 ? T_5 extends T ? T_5 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_6 ? T_6 extends T ? T_6 extends {
                protected: infer TProtected;
            } ? TProtected : {} : never : never;
        };
    })[P_1]; } : never) & Pick<TBase, keyof TBase>> : (TBase extends new (...a: infer A) => unknown ? new (...a: A) => InstanceType<TBase> extends infer T_1 ? { [P in keyof T_1]: InstanceType<TBase>[P]; } : never : never) & import("../types.js").Id<((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected;
            } ? TProtected : {};
        };
    } extends infer T_1 ? { [P in keyof T_1]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected;
            } ? TProtected : {};
        };
    })[P]; } : never) & Pick<TBase, keyof TBase>>;
};
export const Incrementor: {
    extends<TBase extends import("../Constructor.js").Constructor, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A extends any[]) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_1>(self: T_1) => Omit<T_1, "static" | "private" | "protected">;
        Protected: <T_1>(self: T_1) => T_1 extends {
            __: {
                protected: infer TProtected;
            };
        } ? TProtected : never;
        Private: <T_1>(self: T_1) => T_1 extends {
            __: {
                private: infer TPrivate;
            };
        } ? TPrivate : never;
    }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected;
    } ? TProtected : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}), "static" | "private" | "protected"> extends infer T_2 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {})) ? { [P_1 in T_2]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}))[P_1]; } : never;
    } extends infer T_1 ? { [P in keyof T_1]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected;
    } ? TProtected : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}), "static" | "private" | "protected"> extends infer T_2 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {})) ? { [P_1 in T_2]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected;
        } ? TProtected : {}))[P_1]; } : never;
    })[P]; } : never>, brand?: object): T extends {
        constructor: infer _TCtor;
    } ? ((T extends infer T_1 ? T_1 extends T ? T_1 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) extends infer T_3 ? T_3 extends (T extends infer T_1 ? T_1 extends T ? T_1 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) ? T_3 extends (...a: infer A) => void ? new (...a: A) => InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_2 extends keyof T ? { [P in T_2]: T[P]; } : never) extends infer T_4 ? { [P_1 in keyof T_4]: (InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_2 extends keyof T ? { [P in T_2]: T[P]; } : never))[P_1]; } : never : never : never : never) & import("../types.js").Id<((T extends infer T_5 ? T_5 extends T ? T_5 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_6 ? T_6 extends T ? T_6 extends {
                protected: infer TProtected;
            } ? TProtected : {} : never : never;
        };
    } extends infer T_4 ? { [P_1 in keyof T_4]: ((T extends infer T_5 ? T_5 extends T ? T_5 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_6 ? T_6 extends T ? T_6 extends {
                protected: infer TProtected;
            } ? TProtected : {} : never : never;
        };
    })[P_1]; } : never) & Pick<TBase, keyof TBase>> : (TBase extends new (...a: infer A) => unknown ? new (...a: A) => InstanceType<TBase> extends infer T_1 ? { [P in keyof T_1]: InstanceType<TBase>[P]; } : never : never) & import("../types.js").Id<((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected;
            } ? TProtected : {};
        };
    } extends infer T_1 ? { [P in keyof T_1]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected;
            } ? TProtected : {};
        };
    })[P]; } : never) & Pick<TBase, keyof TBase>>;
};
//# sourceMappingURL=Counter.d.ts.map