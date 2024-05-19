'use client';
import { useAtom } from 'jotai';

import { sideBarWidthAtom } from '@/store/course';

import SideBar from '../(dashboard)/_components/SideBar';
import Topbar from '../(dashboard)/_components/Topbar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sideBarWidth] = useAtom(sideBarWidthAtom);

  return (
    <>
      <SideBar />

      <main
        className={`relative h-full max-h-screen transition-all duration-200 ease-soft-in-out ${
          sideBarWidth === 'sm' ? 'ml-[80px]' : 'md:ml-80'
        }  rounded-xl`}
      >
        <Topbar />

        <div className="w-full p-6 mx-auto relative h-[90vh]">{children}</div>
      </main>
    </>
  );
}
