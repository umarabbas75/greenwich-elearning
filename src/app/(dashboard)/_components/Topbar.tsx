'use client';
//import { usePathname } from 'next/navigation';

import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import React from 'react';

import SessionExpireModal from '@/components/common/Modal/SessionExpireModal';
import { useApiGet } from '@/lib/dashboard/client/user';
import { userTimezoneAtom } from '@/store/course';
import { sideBarDrawerAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import 'react-quill/dist/quill.snow.css';

import Notification from './Notification';
import ThemeToggler from './ThemeToggler';
import UserInfo from './UserInfo';

const Topbar = () => {
  const { data: session } = useSession();

  const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  const [userTimezoneState, setUserTimezone] = useAtom(userTimezoneAtom);
  console.log({ userTimezoneState });
  useApiGet<any>({
    endpoint: `/users/${session?.user?.id}`,
    queryKey: ['get-user', session?.user?.id],
    config: {
      select: (res) => res?.data,
      enabled: !!session?.user?.id,
      onSuccess: (data: any) => {
        setUserTimezone(data?.data?.timezone);
      },
    },
  });

  const { data: authData } = useApiGet<any>({
    endpoint: `/auth/me`,
    queryKey: ['auth-me', session?.user?.id],
  });
  console.log({ authData });
  return (
    <nav
      className="flex justify-between items-center h-20 px-9 "
      style={{ boxShadow: '0 0 4px 4px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center">
        <div
          onClick={() => {
            setSideBarDrawer({
              ...sideBarDrawer,
              status: !sideBarDrawer.status,
            });
          }}
          className="dark-icon border rounded visible md:invisible  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary"
        >
          <Icons iconName="menu" className="h-6 w-6 cursor-pointer text-accent" />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Notification />
        <ThemeToggler />

        <UserInfo />
      </div>
      <SessionExpireModal />
    </nav>
  );
};

export default Topbar;
