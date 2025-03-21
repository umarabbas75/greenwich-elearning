'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Icons } from '@/utils/icon';

const PublicNavBar = () => {
  const { data: userData } = useSession();
  const isUserLoggedIn = Boolean(userData?.user?.id);
  return (
    <div className="shadow-sm bg-white">
      <div className="app-container">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link href="/home" replace>
              <Image src="/assets/images/greenwich_logo.png" height={70} width={75} alt="greenwich logo" />
            </Link>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <div className="bg-white dark:bg-black p-2 rounded-lg shadow-md flex items-center">
              <Icons iconName="phone" className="mr-2 w-8 h-8" fill="fill-publicRed" />
              <div>
                <p className="text-sm text-gray-700 font-semibold dark:text-primary">Call us on:</p>
                <div className="flex flex-col">
                  <p className="text-gray-500 text-xs dark:text-white">+92-51-5179324</p>
                  <p className="text-gray-500 text-xs dark:text-white">+92-312-5343061</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black p-2 rounded-lg shadow-md flex items-center max-w-sm">
              <Icons iconName="marker" className="mr-2 w-8 h-8" fill="fill-publicRed" />
              <div>
                <p className="text-sm text-gray-700 font-semibold dark:text-primary">Our office address:</p>
                <p className="text-gray-500 text-xs dark:text-white">
                  1137, Street No. 66, adjacent to Riphah International University, I-14/3
                </p>
              </div>
            </div>

            <div className="self-center">
              <Image src="/assets/images/home/wso-logo.png" height={70} width={70} alt="wso logo" />
            </div>
            {!isUserLoggedIn && (
              <Link href="/" replace>
                <span className="text-sm cursor-pointer text-publicBlue underline font-semibold hover:underline">
                  Login
                </span>
              </Link>
            )}

            {isUserLoggedIn && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-700 dark:text-primary">
                  Welcome, {userData?.user.firstName || 'User'}
                </p>
                <Link href="/" replace>
                  <span className="text-sm cursor-pointer text-publicBlue underline font-semibold hover:underline">
                    Go to Dashboard
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavBar;
