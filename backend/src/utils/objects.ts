/**
 * Deep copy using the JSON stringify -> parse method
 */
export function deepCopy<T>(content: T) {
  return JSON.parse(JSON.stringify(content)) as T;
}
