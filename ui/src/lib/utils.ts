import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deep copy using the JSON stringify -> parse method
 */
export function deepCopy<T>(content: T) {
  return JSON.parse(JSON.stringify(content)) as T;
}
