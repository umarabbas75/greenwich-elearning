'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '@/utils/icon';

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const onMenuChange = () => {
    setOpenMenu((prev) => !prev);
  };
  console.log({ theme });
  if (!mounted) {
    return (
      <div className=" dark-icon border  rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
        <Icons iconName={'moon'} className="h-6 w-6 cursor-pointer " />
      </div>
    );
  }
  return (
    <DropdownMenu onOpenChange={onMenuChange} open={openMenu}>
      <DropdownMenuTrigger asChild>
        <div className=" dark-icon border  rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons
            iconName={theme === 'dark' || theme === 'system' || theme === undefined ? 'sun' : 'moon'}
            className="h-6 w-6 cursor-pointer "
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 bg-white" align="end" side="top">
        <div className="flex flex-col p-2 gap-1 ">
          <span
            className={` dark-icon text-accent text-sm flex items-center gap-2  p-2 font-sm transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover  ${
              theme === 'dark' ? 'text-primary bg-light-hover [&>svg>g>path]:!fill-primary' : ''
            }`}
            onClick={() => {
              setTheme('dark');
              setOpenMenu(false);
            }}
          >
            <Icons iconName="moon" className={`h-6 w-6 cursor-pointer scale-150`} />
            Dark
          </span>
          <span
            className={`dark-icon text-accent text-sm flex items-center gap-2  p-2 font-sm transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover ${
              theme === 'light' ? 'text-primary bg-light-hover [&>svg>g>path]:!fill-primary' : ''
            }`}
            onClick={() => {
              setTheme('light');
              setOpenMenu(false);
            }}
          >
            <Icons iconName="sun" className="w-6 h-6 cursor-pointer" />
            Light
          </span>

          <span
            onClick={() => {
              setTheme('system');
              setOpenMenu(false);
            }}
            className={`dark-icon text-accent text-sm flex items-center gap-2  p-2 font-sm transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover ${
              theme === 'system' ? 'text-primary bg-light-hover [&>svg>g>path]:!fill-primary' : ''
            }`}
          >
            <Icons iconName="display" className="w-6 h-6 cursor-pointer" />
            System
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggler;
