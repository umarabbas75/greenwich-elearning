import { usePathname } from 'next/navigation';

export function useActivePath(): (path: string) => boolean {
  const pathname = usePathname();

  const checkActivePath = (path: string) => {
    if (path === '/' && pathname !== path) {
      return false;
    }

    // Check if the current pathname starts with the provided path.
    if (pathname.startsWith(path)) {
      // Make sure it's an exact match or the next character is a '/'.
      return pathname === path || pathname[path.length] === '/';
    }

    return false;
  };

  return checkActivePath;
}
