import { useAtom } from 'jotai';
import React from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
      <SheetContent side="left" className="w-[250px] sm:w-[500px] bg-black p-0">
        <SideBarContent />
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarDrawer;
