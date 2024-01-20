'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { userModalAtom } from '@/store/modals';

import { UserType } from '../../../../types/user.types';

import UserModal from './_components/UserModal';
import UserTable from './_components/UserTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [userState, setUserState] = useAtom(userModalAtom);

  // const { data, isLoading, error, isError } = useApiCall({
  //   endpoint: `user/auth/${generateQueryString({
  //     page: pagination.pageIndex,
  //     search: debouncedSearch,
  //   })}`,
  //   queryKey: ['get-user', pagination.pageIndex, debouncedSearch],
  // });
  const tempData: UserType[] = [
    {
      firstName: 'asad',
      lastName: 'kamran',
      phone: '+923410666880',
      email: 'umarabbas75@gmail.com',
      role: 'student',
      photo: '',
      status: 'active',
      password: '',
    },
  ];

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
      <UserTable
        data={{
          results: tempData,
          count: 10,
          previous: null,
          next: null,
        }}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={false}
      />
      {/* {data?.results?.length > 0 ? (
        <UserTable
          data={data ?? []}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex item-center justify-center mt-4">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
            <Database />
          </div>
        </div>
      )} */}

      {userState.status && <UserModal />}
    </div>
  );
};

export default Page;
