import { type ClassValue, clsx } from 'clsx';
import { format, isValid, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: any) {
  // Parse the timestamp string to a Date object
  const date = parseISO(timestamp);

  // Check if the parsed date is valid
  if (!isValid(date)) {
    return;
    throw new Error('Invalid timestamp');
  }

  // Format the date
  const formattedDate = format(date, 'MMMM d, yyyy h:mm:ss a');

  return formattedDate;
}

export function getNameInitials(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    throw new Error('Invalid input. Please provide a valid string.');
  }

  // Split the full name into first name and last name
  const names: string[] = fullName.trim().split(/\s+/);

  // Get the first letter of the first name and last name
  const firstInitial: string = names[0]?.charAt(0)?.toUpperCase() || '';
  const lastInitial: string = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';

  // Combine the initials
  const initials: string = firstInitial + lastInitial;

  return initials;
}
