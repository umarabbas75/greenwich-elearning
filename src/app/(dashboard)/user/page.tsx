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

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center mb-4">
        <div className="flex justify-start col-span-1"></div>
        <div className="flex justify-end col-span-1 gap-4">
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
      {isError && <AlertDestructive error={error} />}
      {data?.results?.length > 0 ? (
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
      )}

      {userState.status && <UserModal />}
    </div>
  );
};

export default Page;
