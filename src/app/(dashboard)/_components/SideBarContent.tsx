import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Icons } from '@/utils/icon';

import { sidebarMenu } from './menu';
type ValidIconNames = keyof typeof Icons;
const SideBarContent = () => {
  const { data: session } = useSession();
  const menuItems = sidebarMenu[session?.user.role ?? 'admin'];
  const segment = useSelectedLayoutSegment() ?? '';

  console.log({ menuItems });

  return (
    <>
      <div className="h-20 flex justify-center items-center border-b border-dashed border-gray-500">
        <Link href="/">
          <Image src="/assets/images/greenwich_logo.png" width={80} height={50} alt="Genmark logo" />
        </Link>
      </div>
      <nav className="grid items-start gap-2 p-6">
        {menuItems?.map((item) => {
          if (item?.link && item?.showInSidebar !== false) {
            const iconName = item?.icon as ValidIconNames;

            return (
              <Link key={item?.id} href={item?.link}>
                <span
                  className={`sidenav-icon flex items-center gap-2 rounded-md px-3 py-2  font-medium text-muted  hover:text-white hover:bg-gray-800  transition-colors duration-100 ease-in ${
                    segment === item.link.split('/')?.[1]
                      ? 'bg-gray-800 text-white  active-icon'
                      : 'bg-transparent'
                  }`}
                >
                  <Icons iconName={iconName} className="mr-2 h-8 w-8 " /> {/* Dynamic icon */}
                  <span>{item?.title}</span>
                </span>
              </Link>
            );
          }
        })}
      </nav>
    </>
  );
};

export default SideBarContent;
