'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import * as React from 'react';

import OnLoadAnimation from '@/components/common/OnLoadAnimation';

const SessionProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  return <div>{status === 'loading' ? <OnLoadAnimation /> : children}</div>;
};

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionProviderWrapper>{children}</SessionProviderWrapper>
    </SessionProvider>
  );
}
