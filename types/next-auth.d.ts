import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type Role = 'admin' | 'student';
  interface Session {
    user: {
      expiry: string;
      tenant_uid: string;
      access: string;
      refresh: string;
      first_name: string;
      last_name: string;
      email: string;
      id: string;
      photo: string;
      role: Role;
      customer_id: string;
      customer: string;
    } & DefaultSession['user'];
  }
}
