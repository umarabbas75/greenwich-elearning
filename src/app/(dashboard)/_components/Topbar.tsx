'use client';
//import { usePathname } from 'next/navigation';

import { useAtom } from 'jotai';
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from 'next/navigation';
import React from 'react';

import SessionExpireModal from '@/components/common/Modal/SessionExpireModal';
import { sideBarDrawerAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import 'react-quill/dist/quill.snow.css';

import ThemeToggler from './ThemeToggler';
import UserInfo from './UserInfo';

const Topbar = () => {
  const segments = useSelectedLayoutSegments();
  const params = useParams();
  const pathname = usePathname();
  console.log({ segments, params, pathname });
  const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  const renderBreadcrumb = (segment: any) => {
    // const paramKey = Object.keys(params).find((key) => params[key] === segment);

    // Check if the segment is present in the params object
    if (params && params[segment]) {
      // If present, render the corresponding key from the params object
      return params[segment];
    } else {
      // If not present, render the segment itself
      return segment;
    }
  };
  return (
    <nav className="flex justify-between items-center h-20 px-9  shadow-app-header">
      <>
        <div
          onClick={() => {
            setSideBarDrawer({
              ...sideBarDrawer,
              status: !sideBarDrawer.status,
            });
          }}
          className="dark-icon border rounded visible md:invisible  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary"
        >
          <Icons
            iconName="menu"
            className="h-6 w-6 cursor-pointer text-accent"
          />
        </div>
        <div>
          {segments.map((segment, index) => (
            <span key={index}>
              {renderBreadcrumb(segment)}
              {index < segments.length - 1 && ' > '}
            </span>
          ))}
        </div>
      </>
      <div className="flex gap-2 items-center">
        <div className="dark-icon border rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons
            iconName="notification"
            className="h-6 w-6 cursor-pointer text-accent"
          />
        </div>
        <ThemeToggler />

        <UserInfo />
      </div>
      <SessionExpireModal />
    </nav>
  );
};

export default Topbar;
