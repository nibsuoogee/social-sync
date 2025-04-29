/**
 * Deep copy using the JSON stringify -> parse method
 */
export function deepCopy(content) {
    return JSON.parse(JSON.stringify(content));
}
