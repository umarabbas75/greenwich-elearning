import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type Role = 'admin' | 'user';
  interface Session {
    user: {
      expiry: string;
      timezone?: string;
      phone: string;
      access: string;
      refresh: string;
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      photo: string;
      role: Role;
      customer_id: string;
      customer: string;
    } & DefaultSession['user'];
  }
}
