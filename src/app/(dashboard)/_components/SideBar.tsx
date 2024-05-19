'use client';
import { useAtom } from 'jotai';
import React from 'react';

import { sideBarWidthAtom } from '@/store/course';

import SideBarContent from './SideBarContent';
import SideBarDrawer from './SideBarDrawer';

const SideBar = () => {
  const [sideBarWidth] = useAtom(sideBarWidthAtom);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 bottom-0 w-0 ${
          sideBarWidth === 'sm' ? 'w-[80px]' : 'md:w-full md:max-w-xs '
        } bg-themeGreen   text-white overflow-y-auto `}
      >
        <SideBarContent />
      </aside>
      <SideBarDrawer />
    </>
  );
};

export default SideBar;
