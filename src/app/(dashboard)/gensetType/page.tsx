'use client';

import { useAtom } from 'jotai';
import { Database } from 'lucide-react';
import { useState } from 'react';

import { AlertDestructive } from '@/components/common/FormError';
import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { useFetchGensetTypeList } from '@/lib/dashboard/client/gensetType';
import { gensetTypeModalAtom } from '@/store/modals';
import useDebounce from '@/utils/hooks/useDebounce';

import GensetTypeModal from './_components/GensetTypeModal';
import GensetTypeTable from './_components/GensetTypeTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [gensetTypeState, setGensetTypeState] = useAtom(gensetTypeModalAtom);
  const { data, isLoading, error, isError } = useFetchGensetTypeList({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:flex md:flex-row">
        <div className="md:flex-1"></div>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 md:flex-1">
          <SearchComponent setSearch={setSearch} search={search} />
          <Button
            onClick={() =>
              setGensetTypeState({
                status: true,
                data: null,
              })
            }
          >
            Add New Genset Type
          </Button>
        </div>
      </div>
      {isError && <AlertDestructive error={error} />}
      {data?.results?.length > 0 ? (
        <GensetTypeTable
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

      {gensetTypeState.status && <GensetTypeModal />}
    </div>
  );
};

export default Page;
