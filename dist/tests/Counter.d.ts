export const Counter: {
    extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A extends any[]) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_2>(self: T_2) => Omit<T_2, "static" | "private" | "protected">;
        Protected: <T_3>(self: T_3) => T_3 extends {
            __: {
                protected: infer TProtected;
            };
        } ? TProtected : never;
        Private: <T_4>(self: T_4) => T_4 extends {
            __: {
                private: infer TPrivate;
            };
        } ? TPrivate : never;
    }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "static" | "private" | "protected"> extends infer T_6 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {})) ? { [P_1 in T_6]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P_1]; } : never;
    } extends infer T_5 ? { [P in keyof T_5]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "static" | "private" | "protected"> extends infer T_6 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {})) ? { [P_1 in T_6]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P_1]; } : never;
    })[P]; } : never>, brand?: object | undefined): T extends {
        constructor: infer _TCtor;
    } ? ((T extends infer T_7 ? T_7 extends T ? T_7 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) extends infer T_8 ? T_8 extends (T extends infer T_7 ? T_7 extends T ? T_7 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) ? T_8 extends (...a: infer A_1) => void ? new (...a: A_1) => InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_10 extends keyof T ? { [P_3 in T_10]: T[P_3]; } : never) extends infer T_9 ? { [P_2 in keyof T_9]: (InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_10 extends keyof T ? { [P_3 in T_10]: T[P_3]; } : never))[P_2]; } : never : never : never : never) & (((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    } extends infer T_12 ? { [P_5 in keyof T_12]: ((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    })[P_5]; } : never) & Pick<TBase, keyof TBase> extends infer T_11 ? { [P_4 in keyof T_11]: (((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    } extends infer T_12 ? { [P_5 in keyof T_12]: ((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    })[P_5]; } : never) & Pick<TBase, keyof TBase>)[P_4]; } : never) : (TBase extends new (...a: infer A_2) => unknown ? new (...a: A_2) => InstanceType<TBase> extends infer T_15 ? { [P_6 in keyof T_15]: InstanceType<TBase>[P_6]; } : never : never) & (((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    } extends infer T_17 ? { [P_8 in keyof T_17]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_8]; } : never) & Pick<TBase, keyof TBase> extends infer T_16 ? { [P_7 in keyof T_16]: (((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    } extends infer T_17 ? { [P_8 in keyof T_17]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_8]; } : never) & Pick<TBase, keyof TBase>)[P_7]; } : never);
};
export const Incrementor: {
    extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A extends any[]) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_2>(self: T_2) => Omit<T_2, "static" | "private" | "protected">;
        Protected: <T_3>(self: T_3) => T_3 extends {
            __: {
                protected: infer TProtected;
            };
        } ? TProtected : never;
        Private: <T_4>(self: T_4) => T_4 extends {
            __: {
                private: infer TPrivate;
            };
        } ? TPrivate : never;
    }) => T & Partial<InstanceType<TBase>> & ThisType<Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "static" | "private" | "protected"> extends infer T_6 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {})) ? { [P_1 in T_6]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P_1]; } : never;
    } extends infer T_5 ? { [P in keyof T_5]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "static" | "private" | "protected"> & {
        __: Extract<keyof T, "static" | "private" | "protected"> | Extract<keyof InstanceType<TBase>, "static" | "private" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "static" | "private" | "protected"> extends infer T_6 extends keyof (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {})) ? { [P_1 in T_6]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P_1]; } : never;
    })[P]; } : never>, brand?: object | undefined): T extends {
        constructor: infer _TCtor;
    } ? ((T extends infer T_7 ? T_7 extends T ? T_7 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) extends infer T_8 ? T_8 extends (T extends infer T_7 ? T_7 extends T ? T_7 extends {
        constructor: infer TCtor;
    } ? TCtor : () => void : never : never) ? T_8 extends (...a: infer A_1) => void ? new (...a: A_1) => InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_10 extends keyof T ? { [P_3 in T_10]: T[P_3]; } : never) extends infer T_9 ? { [P_2 in keyof T_9]: (InstanceType<TBase> & (Exclude<keyof T, "static" | "private" | "protected"> extends infer T_10 extends keyof T ? { [P_3 in T_10]: T[P_3]; } : never))[P_2]; } : never : never : never : never) & (((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    } extends infer T_12 ? { [P_5 in keyof T_12]: ((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    })[P_5]; } : never) & Pick<TBase, keyof TBase> extends infer T_11 ? { [P_4 in keyof T_11]: (((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    } extends infer T_12 ? { [P_5 in keyof T_12]: ((T extends infer T_13 ? T_13 extends T ? T_13 extends {
        static: infer TStatic;
    } ? TStatic : {} : never : never) & {
        __: {
            protected: T extends infer T_14 ? T_14 extends T ? T_14 extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {} : never : never;
        };
    })[P_5]; } : never) & Pick<TBase, keyof TBase>)[P_4]; } : never) : (TBase extends new (...a: infer A_2) => unknown ? new (...a: A_2) => InstanceType<TBase> extends infer T_15 ? { [P_6 in keyof T_15]: InstanceType<TBase>[P_6]; } : never : never) & (((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    } extends infer T_17 ? { [P_8 in keyof T_17]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_8]; } : never) & Pick<TBase, keyof TBase> extends infer T_16 ? { [P_7 in keyof T_16]: (((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    } extends infer T_17 ? { [P_8 in keyof T_17]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_8]; } : never) & Pick<TBase, keyof TBase>)[P_7]; } : never);
};
//# sourceMappingURL=Counter.d.ts.map