'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

// import { cn } from '@/lib/utils';

import LoadingButton from '@/components/common/LoadingButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
export const LoginAuthForm = () => {
  const { toast } = useToast();
  const initialState = {
    email: '',
    password: '',
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: state.email,
      password: state.password,
    });
    if (res?.error) {
      toast({
        variant: 'destructive',
        // className: cn(
        //   'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
        // ),
        //title: 'Error',
        description: res?.error ?? 'Incorrect email/password',
      });
    }
    setIsLoading(false);
    router.push('/');
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-6">
        <div className="grid gap-1">
          <Label htmlFor="email" className="text-white text-md">
            Your email
          </Label>
          <Input
            id="email"
            // placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="bg-transparent text-white"
            disabled={isLoading}
            value={state.email}
            onChange={(e) => {
              setState((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password" className="text-white text-md">
            Your password
          </Label>
          <Input
            id="password"
            // placeholder="name@example.com"
            type="password"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="bg-transparent text-white"
            disabled={isLoading}
            value={state.password}
            onChange={(e) => {
              setState((prev) => ({ ...prev, password: e.target.value }));
            }}
          />
        </div>
        <LoadingButton type="submit" loading={isLoading}>
          Login
        </LoadingButton>
      </div>
    </form>
  );
};
