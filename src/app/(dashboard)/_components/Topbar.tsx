'use client';
//import { usePathname } from 'next/navigation';

import { useAtom } from 'jotai';
import React from 'react';

import SessionExpireModal from '@/components/common/Modal/SessionExpireModal';
import { sideBarDrawerAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import ThemeToggler from './ThemeToggler';
import UserInfo from './UserInfo';

const Topbar = () => {
  const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  return (
    <nav className="flex justify-between items-center h-20 px-9  shadow-app-header">
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
      <div className="flex gap-2 items-center">
        <div className="dark-icon border rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons
            iconName="notification"
            className="h-6 w-6 cursor-pointer text-accent"
          />
        </div>
        <ThemeToggler />

        <UserInfo />
      </div>
      <SessionExpireModal />
    </nav>
  );
};

export default Topbar;
