import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Ensure the path starts with /storage/ if it's a relative path from the DB
  let cleanPath = path;
  if (!path.startsWith('/') && !path.startsWith('storage/')) {
    cleanPath = '/storage/' + path;
  } else if (path.startsWith('storage/')) {
    cleanPath = '/' + path;
  }
  
  return `${BACKEND_URL}${cleanPath}`;
};