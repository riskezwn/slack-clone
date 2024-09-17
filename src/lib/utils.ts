import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameFirstTwoLetters(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function getNameFirstLetter(name: string) {
  return name.charAt(0).toUpperCase();
}
