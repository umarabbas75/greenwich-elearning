'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  const role = session.data?.user?.role;
  return (
    <Tabs
      value={pathname === '/setting/account' ? 'account' : 'policies'}
      defaultValue="account"
      className="w-full"
      onValueChange={(route) => {
        router.push(`/setting/${route}`);
      }}
    >
      <TabsList className={`grid w-[400px] ${role === 'user' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <TabsTrigger value="account">Account</TabsTrigger>

        {role === 'user' && <TabsTrigger value="policies">Policies and procedures</TabsTrigger>}
      </TabsList>

      {children}
    </Tabs>
  );
};

export default Layout;
