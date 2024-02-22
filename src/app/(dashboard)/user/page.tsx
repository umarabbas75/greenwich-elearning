'use client';

import { useAtom } from 'jotai';
import Error from 'next/error';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';

import UserModal from './_components/UserModal';
import UserTable from './_components/UserTable';
export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  role: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  courses: string[];
};

export type UsersDataResponse = {
  message: string;
  statusCode: number;
  data: UserData[];
};
const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [userState, setUserState] = useAtom(userModalAtom);

  const { data: usersData, isLoading } = useApiGet<UsersDataResponse, Error>({
    endpoint: `/users`,
    queryKey: ['get-users'],
  });
  console.log({ usersData });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
        <div className="col-span-2  md:col-span-1 ">
          <div className="flex justify-end gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                setUserState({
                  status: true,
                  data: null,
                })
              }
            >
              Add User
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}

      {usersData && usersData.data && usersData.data.length > 0 ? (
        <UserTable
          data={usersData}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex item-center justify-center mt-4">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
          </div>
        </div>
      )}

      {userState.status && <UserModal />}
    </div>
  );
};

export default Page;
