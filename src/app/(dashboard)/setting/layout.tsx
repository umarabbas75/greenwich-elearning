'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <Tabs
      defaultValue="account"
      className="w-full"
      onValueChange={(route) => {
        router.push(`/setting/${route}`);
      }}
    >
      {session?.user?.role === 'admin' && (
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>

          <TabsTrigger value="users">Portal User</TabsTrigger>
        </TabsList>
      )}
      {children}
    </Tabs>
  );
};

export default Layout;
