'use client';

import { useAtom } from 'jotai';
import { Database } from 'lucide-react';
import { useState } from 'react';

import { AlertDestructive } from '@/components/common/FormError';
import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { useFetchGensetList } from '@/lib/dashboard/client/genset';
import { gensetModalAtom } from '@/store/modals';
import useCanUserAccess from '@/utils/hooks/useCanUserAccess';
import useDebounce from '@/utils/hooks/useDebounce';

import GensetModal from './_components/GensetModal';
import GensetTable from './_components/GensetTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [catState, setCatState] = useAtom(gensetModalAtom);
  const { data, isLoading, error, isError } = useFetchGensetList({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
  });

  const [canCreate] = useCanUserAccess({
    module: 'genset',
    access: ['create'],
  });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="flex justify-start"></div>
        <div className="flex justify-end">
          <div className="flex gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            {canCreate && (
              <Button
                onClick={() =>
                  setCatState({
                    status: true,
                    data: null,
                  })
                }
              >
                Add New Genset
              </Button>
            )}
          </div>
        </div>
      </div>
      {isError && <AlertDestructive error={error} />}
      {data?.results?.length > 0 ? (
        <GensetTable
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

      {catState.status && <GensetModal />}
    </div>
  );
};

export default Page;
