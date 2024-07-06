'use client';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import NameInitials from '@/components/NameInitials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userPhotoAtom } from '@/store/course';
import { Icons } from '@/utils/icon';
import { getInitials } from '@/utils/utils';
const UserInfo = () => {
  const [userPhotoState] = useAtom(userPhotoAtom);

  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();
  const logoutUser = async () => {
    setIsLoading(true);

    // const response = await loginUser({
    //   method: 'post',
    //   path: '/api/login',
    //   data: {
    //     name: 'umar',
    //     password: '124',
    //   },
    // });

    await signOut({ callbackUrl: '/login' });
    setIsLoading(false);
    //router.push('/login');
  };

  const onMenuChange = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <DropdownMenu onOpenChange={onMenuChange} open={openMenu}>
      <DropdownMenuTrigger asChild>
        <div
          className={`dark-icon border cursor-pointer hover:bg-dark-icon-hover rounded  p-2 text-accent transition duration-300 ${
            openMenu ? 'bg-dark-icon-hover text-primary active-icon' : ''
          } `}
        >
          {userPhotoState ? (
            <Image
              src={userPhotoState}
              className="rounded-full cursor-pointer"
              width={28}
              height={28}
              alt="Profile image"
              objectFit="contain"
            />
          ) : (
            <Icons iconName="customer" className="h-6 w-6 cursor-pointer " />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-white" align="end" side="top">
        <div className="flex gap-2 items-center p-2">
          {userPhotoState ? (
            <Image src={userPhotoState} className="rounded-full" width={50} height={50} alt="Profile image" />
          ) : (
            <NameInitials
              className={`w-16 h-16 font-normal  shadow-sm border border-white text-sm`}
              initials={getInitials(`${session?.user?.firstName} ${session?.user?.lastName}`)}
            />
          )}

          <div className="flex flex-col gap-0">
            <span className="font-bold text-lg text-black">
              {session?.user?.firstName}
              {session?.user?.lastName}
            </span>
            <span className="text-sm text-accent">{session?.user?.email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="flex flex-col p-2 gap-1 ">
          <span
            onClick={() => {
              router.push('/setting/account');
            }}
            className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          >
            <Icons iconName="setting" className="w-6 h-6 cursor-pointer" />
            Settings
          </span>

          <span
            onClick={logoutUser}
            className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          >
            <Icons iconName="logout" className="w-6 h-6 cursor-pointer " />
            {loading ? 'wait...' : 'Log out'}
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
