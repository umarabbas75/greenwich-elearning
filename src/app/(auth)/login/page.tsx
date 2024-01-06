import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { LoginAuthForm } from './_components/LoginAuthForm';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

const page = () => {
  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="grid justify-center mb-4">
              <Image
                src="/assets/images/genmark_logo.png"
                width={350}
                height={200}
                alt="Genmark logo"
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login into your account
            </p>
          </div>
          <LoginAuthForm />
          <p className="text-right text-sm text-muted-foreground">
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Forgot password?
            </Link>{' '}
          </p>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          src="/assets/images/genmark_login_bg.png"
          fill={true}
          alt="Genmark login picture"
        />
      </div>
    </>
  );
};

export default page;
