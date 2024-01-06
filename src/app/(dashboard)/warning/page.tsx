'use client';

import { Database } from 'lucide-react';
import { useState } from 'react';

import ErrorComponent from '@/components/common/Error';
import SearchComponent from '@/components/common/SearchInput';
import { useFetchWarningList } from '@/lib/dashboard/client/warning';

import CSVModal from './_components/CSVModal';
import WarningTable from './_components/WarningTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error, isError } = useFetchWarningList();

  if (isError) {
    return <ErrorComponent errorMessage={(error as Error).message} />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="flex justify-start"></div>
        <div className="flex justify-end">
          <div className="flex gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <CSVModal />
          </div>
        </div>
      </div>

      {data?.results?.length > 0 ? (
        <WarningTable
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
    </div>
  );
};

export default Page;
