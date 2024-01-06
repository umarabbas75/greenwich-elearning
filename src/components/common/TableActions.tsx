import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/utils/icon';

const TableActions = ({ children }: { children: React.ReactNode }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const onMenuChange = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <DropdownMenu onOpenChange={onMenuChange} open={openMenu}>
      <DropdownMenuTrigger asChild>
        <div className="dark-icon rounded-sm hover:bg-dark-icon-hover rounded w-fit  p-1 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons
            iconName="action"
            className=" h-6 w-6 text-gray rotate-90 cursor-pointer "
          />
          <span className="sr-only">Open menu</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-white">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
