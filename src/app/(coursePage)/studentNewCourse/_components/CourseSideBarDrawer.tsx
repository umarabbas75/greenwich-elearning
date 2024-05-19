import { useAtom } from 'jotai';
import React from 'react';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { courseDrawerAtom } from '@/store/modals';

const CourseSideBarDrawer = ({ children }: any) => {
  const [courseDrawerState, setCourseDrawerState] = useAtom(courseDrawerAtom);

  return (
    <Sheet
      open={courseDrawerState.status}
      onOpenChange={() => {
        setCourseDrawerState({
          ...courseDrawerState,
          status: !courseDrawerState.status,
        });
      }}
    >
      <SheetContent side="left" className=" max-w-sm w-96 bg-white p-0">
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default CourseSideBarDrawer;
