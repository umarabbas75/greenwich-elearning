import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { LoginAuthForm } from './_components/LoginAuthForm';

export const metadata: Metadata = {
  title: 'Greenwich',
  description: 'Greewich home page.',
};

const page = () => {
  return (
    <>
      <div className="lg:p-8 relative h-full bg-themeGreen flex items-center justify-center">
        <Image
          src="/assets/images/greenwich_logo.png"
          className="absolute top-10 left-10"
          width={80}
          height={140}
          alt="Greenwich logo"
        />
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="grid justify-center mb-4"></div>

            <p className="text-2xl text-white">
              Awesome, ready to get going? Just login below and you’re on your way...
            </p>
          </div>
          <LoginAuthForm />
          <p className="text-right text-sm text-muted-foreground">
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Forgot password?
            </Link>{' '}
          </p>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-white p-10 md:flex justify-center items-center text-white dark:border-r lg:flex">
        <Image src="/assets/images/loginVector.svg" width="500" height="500" alt="Greenwich login picture" />
      </div>
    </>
  );
};

export default page;
