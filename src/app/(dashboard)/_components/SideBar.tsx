'use client';
import React from 'react';

import SideBarContent from './SideBarContent';
import SideBarDrawer from './SideBarDrawer';

const SideBar = () => {
  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-0 max-w-0 md:w-full md:max-w-xs bg-themeGreen   text-white overflow-y-auto ">
        <SideBarContent />
      </aside>
      <SideBarDrawer />
    </>
  );
};

export default SideBar;
