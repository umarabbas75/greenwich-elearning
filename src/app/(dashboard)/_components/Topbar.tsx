'use client';
//import { usePathname } from 'next/navigation';

import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import React from 'react';

import SessionExpireModal from '@/components/common/Modal/SessionExpireModal';
import { useApiGet } from '@/lib/dashboard/client/user';
import { userPhotoAtom, userTimezoneAtom } from '@/store/course';
import { sideBarDrawerAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import 'react-quill/dist/quill.snow.css';

import ThemeToggler from './ThemeToggler';
import UserInfo from './UserInfo';

const Topbar = () => {
  const { data: session } = useSession();

  const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  const [userPhotoState, setUserPhotoAtom] = useAtom(userPhotoAtom);
  const [userTimezoneState, setUserTimezone] = useAtom(userTimezoneAtom);
  console.log({ userPhotoState, userTimezoneState });
  useApiGet<any>({
    endpoint: `/users/${session?.user?.id}`,
    queryKey: ['get-user', session?.user?.id],
    config: {
      select: (res) => res?.data,
      enabled: !!session?.user?.id,
      onSuccess: (data: any) => {
        setUserPhotoAtom(data?.data?.photo ?? '');
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
    <nav className="flex justify-between items-center h-20 px-9  shadow-app-header">
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
        {/* <div>
          {segments.map((segment, index) => (
            <span key={index}>
              {renderBreadcrumb(segment)}
              {index < segments.length - 1 && ' > '}
            </span>
          ))}
        </div> */}
      </div>
      <div className="flex gap-2 items-center">
        <div className="dark-icon border rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons iconName="notification" className="h-6 w-6 cursor-pointer text-accent" />
        </div>
        <ThemeToggler />

        <UserInfo />
      </div>
      <SessionExpireModal />
    </nav>
  );
};

export default Topbar;
