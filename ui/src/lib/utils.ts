import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
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

interface DecodedToken {
  id: number;
}

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch (e) {
    console.error("invalid token: ", e);
    return null;
  }
};
