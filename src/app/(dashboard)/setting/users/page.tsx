'use client';

import { useAtom } from 'jotai';
import { Database } from 'lucide-react';
import { useState } from 'react';

import { AlertDestructive } from '@/components/common/FormError';
import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { useFetchUserList } from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';
import useDebounce from '@/utils/hooks/useDebounce';

import UserModal from './_components/UserModal';
import UserTable from './_components/UserTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [userState, setUserState] = useAtom(userModalAtom);
  const { data, isLoading, error, isError } = useFetchUserList({
    page: pagination.pageIndex + 1,
    search: debouncedSearch,
  });

  // if (isError) {
  //   toast({
  //     variant: 'destructive',

  //     description: error?.message,
  //   });
  // }

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="flex justify-start"></div>
        <div className="flex justify-end">
          <div className="flex gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                setUserState({
                  status: true,
                  data: null,
                })
              }
            >
              Add New User
            </Button>
          </div>
        </div>
      </div>
      {isError && <AlertDestructive error={error} />}
      {data?.results?.length > 0 ? (
        <UserTable
          data={data ?? []}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex item-center justify-center">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
            <Database />
          </div>
        </div>
      )}

      {userState.status && <UserModal />}
    </div>
  );
};

export default Page;
