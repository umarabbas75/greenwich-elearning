import { useAtom } from 'jotai';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { sideBarDrawerAtom } from '@/store/modals';

import SideBarContent from './SideBarContent';

const SideBarDrawer = () => {
  const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  return (
    <Sheet
      open={sideBarDrawer.status}
      onOpenChange={() => {
        setSideBarDrawer({
          ...sideBarDrawer,
          status: !sideBarDrawer.status,
        });
      }}
    >
      <SheetContent side="left" className="w-[250px] sm:w-[500px] bg-themeGreen p-0">
        <SideBarContent />
      </SheetContent>
    </Sheet>
  );
};

export default SideBarDrawer;
