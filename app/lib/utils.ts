import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Helper funkcia na spájanie className hodnôt s Tailwind CSS
 * Používa clsx na podmienené triedy a tailwind-merge na riešenie konfliktov
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

