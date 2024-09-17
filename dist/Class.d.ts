import { Constructor } from './Constructor.js';
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
        extends<TBase extends Constructor, T>(base: TBase, members: (helpers: {
            Super: SuperHelper<TBase>;
            Public: PublicHelper;
            Protected: ProtectedHelper;
            Private: PrivateHelper;
        }) => T & Partial<InstanceType<TBase>> & ThisType<LowClassThis<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>>, brand?: object): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, Id<InstanceType<TBase> & OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>> : ReplaceCtorReturn<TBase, Id<InstanceType<TBase>>> & Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>>;
    };
    <T>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T & ThisType<LowClassThis<T>>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>;
    <T>(name: string, members: T & ThisType<LowClassThis<T>>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>;
};
export declare function createClassHelper(options?: any): {
    (): typeof Object;
    (name: string): {
        extends<TBase extends Constructor, T>(base: TBase, members: (helpers: {
            Super: SuperHelper<TBase>;
            Public: PublicHelper;
            Protected: ProtectedHelper;
            Private: PrivateHelper;
        }) => T & Partial<InstanceType<TBase>> & ThisType<LowClassThis<T & InstanceType<TBase> & ExtractInheritedProtected<TBase>>>, brand?: object): T extends {
            constructor: infer _TCtor;
        } ? FunctionToConstructor<ConstructorOrDefault<T>, Id<InstanceType<TBase> & OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>> : ReplaceCtorReturn<TBase, Id<InstanceType<TBase>>> & Id<StaticsAndProtected<T> & Pick<TBase, keyof TBase>>;
    };
    <T>(name: string, members: (helpers: {
        Public: PublicHelper;
        Protected: ProtectedHelper;
        Private: PrivateHelper;
        Super: never;
    }) => T & ThisType<LowClassThis<T>>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>;
    <T>(name: string, members: T & ThisType<LowClassThis<T>>, brand?: object): FunctionToConstructor<ConstructorOrDefault<T>, Id<OmitImplementationKeys<T>>> & Id<StaticsAndProtected<T>>;
};
export {};
//# sourceMappingURL=Class.d.ts.map