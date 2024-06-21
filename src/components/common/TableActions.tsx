import React, { useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '@/utils/icon';

const TableActions = ({ children }: { children: React.ReactNode }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const onMenuChange = () => {
    console.log({ onMenuChange });
    setOpenMenu((prev) => !prev);
  };
  console.log({ openMenu });

  return (
    <DropdownMenu onOpenChange={onMenuChange} open={openMenu}>
      <DropdownMenuTrigger asChild>
        <div className="dark-icon rounded w-fit  p-1 text-accent transition duration-300   hover:text-primary">
          <Icons iconName="action" className=" h-6 w-6 text-gray rotate-90 cursor-pointer " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" bg-white">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
