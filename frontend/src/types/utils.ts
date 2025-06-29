export type TypedOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type UUID = string;
