/**
 * tryCatch - Error handling that can be synchronous or asynchronous
 * based on the input function.
 *
 * @param fn Function to execute, Promise or value.
 * @param operationName Optional name for context.
 * @returns A Result, or a Promise resolving to a Result, depending on fn.
 */
export function tryCatch(fn, operationName) {
    try {
        const result = typeof fn === "function" ? fn() : fn;
        if (result instanceof Promise)
            return result
                .then((data) => [data, null])
                .catch((rawError) => handleError(rawError, operationName));
        return [result, null];
    }
    catch (rawError) {
        return handleError(rawError, operationName);
    }
}
tryCatch.sync = tryCatchSync;
tryCatch.async = tryCatchAsync;
export function tryCatchSync(fn, operationName) {
    try {
        const result = fn();
        return [result, null];
    }
    catch (rawError) {
        return handleError(rawError, operationName);
    }
}
export async function tryCatchAsync(fn, operationName) {
    try {
        const promise = typeof fn === "function" ? fn() : fn;
        const data = await promise;
        return [data, null];
    }
    catch (rawError) {
        return handleError(rawError, operationName);
    }
}
function handleError(rawError, operationName) {
    const processedError = rawError instanceof Error ? rawError : new Error(String(rawError));
    if (operationName) {
        processedError.message = `Operation "${operationName}" failed: ${processedError.message}`;
    }
    return [null, processedError];
}
