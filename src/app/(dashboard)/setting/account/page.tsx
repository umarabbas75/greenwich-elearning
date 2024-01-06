'use client';
import { CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/utils/icon';

import UpdateImageForm from './_components/UpdateImageForm';
import UpdateNameForm from './_components/UpdateNameForm';
import UpdatePassword from './_components/UpdatePassword';
const Page = () => {
  const { data: session } = useSession();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <TabsContent value="account">
      <div className="flex justify-between items-center py-4 border-b ">
        <div>
          <h3 className="text-xl font-bold">Account Details</h3>
          <p className="text-accent">
            Update your email, name, and profile picture
          </p>
        </div>
        <div
          className={`${
            isEdit ? 'text-primary border-primary  active-icon' : ''
          } p-2 border rounded-sm text-accent flex items-center gap-2 dark-icon cursor-pointer hover:text-primary hover:border-primary transition`}
          onClick={() => {
            setIsEdit((prev) => !prev);
          }}
        >
          <Icons iconName="pencil" className="w-6 h-6  " />
          <span>Edit</span>
        </div>
      </div>

      <UpdateImageForm isEdit={isEdit} />

      <UpdateNameForm isEdit={isEdit} />

      <div className="grid grid-cols-3  items-center py-4 border-b ">
        <div className="col-span-1">
          <h3 className="text-xl font-bold">Email</h3>
          <p className="text-accent">Your portal sign-in email address.</p>
        </div>
        <div className="col-span-2  ">
          <div className="flex items-center mb-2">
            <span className="font-semiBold">{session?.user?.email}</span>
            <CheckCircle2 className="ml-2 text-green-500" />
          </div>
          <p className="text-accent text-sm">your email address is verified</p>
        </div>
      </div>

      <div className="grid grid-cols-3  items-center py-4 border-b ">
        <div className="col-span-1">
          <h3 className="text-xl font-bold">Password</h3>
          <p className="text-accent">Change your password</p>
        </div>
        <div className="col-span-2  flex items-center gap-4">
          <UpdatePassword isEdit={isEdit} />
        </div>
      </div>
    </TabsContent>
  );
};
export default Page;
