export type Id<T> = {} & {
    [P in keyof T]: T[P];
};
//# sourceMappingURL=types.d.ts.map