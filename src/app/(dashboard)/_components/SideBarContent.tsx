import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { sideBarWidthAtom } from '@/store/course';
import useWindowWidth from '@/utils/hooks/useWindowWidth';
import { Icons } from '@/utils/icon';

import { sidebarMenu } from './menu';
type ValidIconNames = keyof typeof Icons;
const SideBarContent = () => {
  const { data: session } = useSession();
  const menuItems = sidebarMenu[session?.user.role ?? 'admin'];
  const segment = useSelectedLayoutSegment() ?? '';
  const width = useWindowWidth();
  const [sideBarWidth, setSideBarWidth] = useAtom(sideBarWidthAtom);
  return (
    <>
      <div
        className={`h-20 bg-[#24342c] flex gap-10 ${
          sideBarWidth === 'lg' ? 'px-10  justify-start' : 'px-2 justify-center'
        }  items-center border-b border-dashed border-gray-500`}
      >
        {width > 768 && (
          <MenuOpen
            className="cursor-pointer"
            onClick={() => {
              setSideBarWidth(sideBarWidth === 'lg' ? 'sm' : 'lg');
            }}
          />
        )}
        {sideBarWidth === 'lg' && (
          <Link href="/home">
            <Image src="/assets/images/greenwich_logo.png" width={60} height={40} alt="greenwich logo" />
          </Link>
        )}
      </div>
      <nav className={`grid items-start gap-2 ${sideBarWidth === 'lg' ? 'p-6' : 'p-2'}`}>
        {menuItems?.map((item) => {
          if (item?.link && item?.showInSidebar !== false) {
            const iconName = item?.icon as ValidIconNames;

            return (
              <Link key={item?.id} href={item?.link}>
                <span
                  className={`sidenav-icon flex items-center gap-2 rounded-md px-3 py-2  font-medium text-muted  hover:text-white hover:bg-primary  transition-colors duration-100 ease-in
                  ${sideBarWidth === 'lg' ? 'justify-start' : 'justify-center'}
                  ${
                    segment === item.link.split('/')?.[1]
                      ? 'bg-primary text-white  active-icon'
                      : 'bg-transparent'
                  }`}
                >
                  <div className="w-8">
                    <Icons iconName={iconName} className="mr-2 h-8 w-8 " /> {/* Dynamic icon */}
                  </div>
                  {sideBarWidth === 'lg' && <span>{item?.title}</span>}
                </span>
              </Link>
            );
          }
        })}
      </nav>
    </>
  );
};

// const MenuIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       xmlnsXlink="http://www.w3.org/1999/xlink"
//       width="24px"
//       height="24px"
//       viewBox="0 0 24 24"
//       version="1.1"
//     >
//       <title>Stockholm-icons / Text / Menu</title>
//       <desc>Created with Sketch.</desc>
//       <defs></defs>
//       <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//         <rect x="0" y="0" width="24" height="24"></rect>
//         <rect fill="#ffffff" x="4" y="5" width="16" height="3" rx="1.5"></rect>
//         <path
//           d="M5.5,15 L18.5,15 C19.3284271,15 20,15.6715729 20,16.5 C20,17.3284271 19.3284271,18 18.5,18 L5.5,18 C4.67157288,18 4,17.3284271 4,16.5 C4,15.6715729 4.67157288,15 5.5,15 Z M5.5,10 L18.5,10 C19.3284271,10 20,10.6715729 20,11.5 C20,12.3284271 19.3284271,13 18.5,13 L5.5,13 C4.67157288,13 4,12.3284271 4,11.5 C4,10.6715729 4.67157288,10 5.5,10 Z"
//           fill="#ffffff"
//           opacity="0.3"
//         ></path>
//       </g>
//     </svg>
//   );
// };

const MenuOpen = ({ className, onClick }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 128 128"
      id="menu-open"
      className={className}
      onClick={onClick}
    >
      <g clip-path="url(#clip0_21_514)">
        <path
          stroke="#ffffff"
          stroke-width="8"
          d="M12 96L91 96M12 64L69 64M12 32L91 32M113.522 94L83.0001 63.478 113.522 32.9561"
        />
      </g>
      <defs>
        <clipPath id="clip0_21_514">
          <rect width="128" height="128" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SideBarContent;
