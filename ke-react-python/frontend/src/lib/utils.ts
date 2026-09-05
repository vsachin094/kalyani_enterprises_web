import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePublicImagePath(source: string) {
  if (source.startsWith('/')) return source;
  if (source.startsWith('images/')) return `/${source}`;
  return `/images/${source}`;
}