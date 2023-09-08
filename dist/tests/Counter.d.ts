export const Counter: {
    extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_2>(self: T_2) => Omit<T_2, "private" | "static" | "protected">;
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
    }) => T & Partial<InstanceType<TBase>> & ThisType<{ [P_1 in keyof (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "private" | "static" | "protected"> & {
        __: { [P in Extract<keyof T, "private" | "static" | "protected"> | Extract<keyof InstanceType<TBase>, "private" | "static" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "private" | "static" | "protected">]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P]; };
    })]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "private" | "static" | "protected"> & {
        __: { [P in Extract<keyof T, "private" | "static" | "protected"> | Extract<keyof InstanceType<TBase>, "private" | "static" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "private" | "static" | "protected">]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P]; };
    })[P_1]; }>, brand?: object | undefined): T extends {
        constructor: infer _TCtor;
    } ? ((T extends {
        constructor: infer TCtor;
    } ? TCtor : () => void) extends (...a: infer A_1) => void ? new (...a: A_1) => { [P_3 in keyof (InstanceType<TBase> & { [P_2 in Exclude<keyof T, "private" | "static" | "protected">]: T[P_2]; })]: (InstanceType<TBase> & { [P_2 in Exclude<keyof T, "private" | "static" | "protected">]: T[P_2]; })[P_3]; } : never) & { [P_5 in keyof ({ [P_4 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_4]; } & Pick<TBase, keyof TBase>)]: ({ [P_4 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_4]; } & Pick<TBase, keyof TBase>)[P_5]; } : (TBase extends new (...a: infer A_2) => unknown ? new (...a: A_2) => { [P_6 in keyof InstanceType<TBase>]: InstanceType<TBase>[P_6]; } : never) & { [P_8 in keyof ({ [P_7 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_7]; } & Pick<TBase, keyof TBase>)]: ({ [P_7 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_7]; } & Pick<TBase, keyof TBase>)[P_8]; };
};
export const Incrementor: {
    extends<TBase extends new (...a: any[]) => object, T>(base: TBase, members: (helpers: {
        Super: <T_1>(self: T_1) => TBase extends new (...a: infer A) => infer I ? {
            constructor: (...a: A) => I;
        } & InstanceType<TBase> : never;
        Public: <T_2>(self: T_2) => Omit<T_2, "private" | "static" | "protected">;
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
    }) => T & Partial<InstanceType<TBase>> & ThisType<{ [P_1 in keyof (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "private" | "static" | "protected"> & {
        __: { [P in Extract<keyof T, "private" | "static" | "protected"> | Extract<keyof InstanceType<TBase>, "private" | "static" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "private" | "static" | "protected">]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P]; };
    })]: (Omit<T & InstanceType<TBase> & (TBase extends {
        __: infer TProtected_1;
    } ? TProtected_1 : {}), "private" | "static" | "protected"> & {
        __: { [P in Extract<keyof T, "private" | "static" | "protected"> | Extract<keyof InstanceType<TBase>, "private" | "static" | "protected"> | Extract<keyof (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}), "private" | "static" | "protected">]: (T & InstanceType<TBase> & (TBase extends {
            __: infer TProtected_1;
        } ? TProtected_1 : {}))[P]; };
    })[P_1]; }>, brand?: object | undefined): T extends {
        constructor: infer _TCtor;
    } ? ((T extends {
        constructor: infer TCtor;
    } ? TCtor : () => void) extends (...a: infer A_1) => void ? new (...a: A_1) => { [P_3 in keyof (InstanceType<TBase> & { [P_2 in Exclude<keyof T, "private" | "static" | "protected">]: T[P_2]; })]: (InstanceType<TBase> & { [P_2 in Exclude<keyof T, "private" | "static" | "protected">]: T[P_2]; })[P_3]; } : never) & { [P_5 in keyof ({ [P_4 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_4]; } & Pick<TBase, keyof TBase>)]: ({ [P_4 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_4]; } & Pick<TBase, keyof TBase>)[P_5]; } : (TBase extends new (...a: infer A_2) => unknown ? new (...a: A_2) => { [P_6 in keyof InstanceType<TBase>]: InstanceType<TBase>[P_6]; } : never) & { [P_8 in keyof ({ [P_7 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_7]; } & Pick<TBase, keyof TBase>)]: ({ [P_7 in keyof ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })]: ((T extends {
        static: infer TStatic;
    } ? TStatic : {}) & {
        __: {
            protected: T extends {
                protected: infer TProtected_2;
            } ? TProtected_2 : {};
        };
    })[P_7]; } & Pick<TBase, keyof TBase>)[P_8]; };
};
//# sourceMappingURL=Counter.d.ts.map