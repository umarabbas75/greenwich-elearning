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

export function getInitials(name: string): string {
  // Trim leading and trailing whitespace
  name = name.trim();

  // Check if the name is empty after trimming
  if (name.length === 0) {
    return '';
  }

  // Split the name by spaces
  const parts = name.split(/\s+/);

  // Handle single names
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // Get the first character of the first two parts and capitalize them
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const secondInitial = parts[1].charAt(0).toUpperCase();

  // Combine the initials
  return firstInitial + secondInitial;
}

export const extractPublicId = (url: string): string | null => {
  try {
    // Define the regular expression to match the public ID in the Cloudinary URL
    const regex = /\/v\d+\/[^/]+\/([^/]+)\.[a-zA-Z]+$/;

    // Execute the regular expression on the provided URL
    const match = url.match(regex);

    // If a match is found, return the first capturing group (public ID)
    if (match && match[1]) {
      return match[1];
    }

    // If no match is found, return null
    return null;
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error extracting public ID:', error);
    return null;
  }
};

export const extractFileType = (url: string): string | null => {
  try {
    // Define the regular expression to match the file type in the Cloudinary URL
    const regex = /\.([a-zA-Z0-9]+)$/;

    // Execute the regular expression on the provided URL
    const match = url.match(regex);

    // If a match is found, return the first capturing group (file type)
    if (match && match[1]) {
      return match[1];
    }

    // If no match is found, return null
    return null;
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error extracting file type:', error);
    return null;
  }
};

export const resizeImage = (image: any, maxWidth: any, maxHeight: any) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');

    let { width, height } = image;
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Adjust quality as needed
  });
};
