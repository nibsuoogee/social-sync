type Success<T> = [data: T, error: null];
type Failure<E> = [data: null, error: E];
export type Result<T, E = Error> = Success<T> | Failure<E>;
export type TryCatchReturn<T> = T extends Promise<infer U> ? Promise<Result<U, Error>> : Result<T, Error>;
/**
 * tryCatch - Error handling that can be synchronous or asynchronous
 * based on the input function.
 *
 * @param fn Function to execute, Promise or value.
 * @param operationName Optional name for context.
 * @returns A Result, or a Promise resolving to a Result, depending on fn.
 */
export declare function tryCatch<T>(fn?: T | (() => T), operationName?: string): TryCatchReturn<T>;
export declare namespace tryCatch {
    var sync: typeof tryCatchSync;
    var async: typeof tryCatchAsync;
}
export declare function tryCatchSync<T>(fn: () => T, operationName?: string): Result<T, Error>;
export declare function tryCatchAsync<T>(fn: Promise<T> | (() => Promise<T>), operationName?: string): Promise<Result<T, Error>>;
export {};
