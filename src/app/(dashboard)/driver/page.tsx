'use client';

import { Database } from 'lucide-react';
import { useState } from 'react';

import ErrorComponent from '@/components/common/Error';
import SearchComponent from '@/components/common/SearchInput';
import { useFetchDriverList } from '@/lib/dashboard/client/driver';

import CSVModal from './_components/CSVModal';
import DriverTable from './_components/DriverTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  //const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error, isError } = useFetchDriverList({
    page: pagination.pageIndex + 1,
  });

  if (isError) {
    return <ErrorComponent errorMessage={(error as Error).message} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex md:flex-row">
        <div className="md:flex-1"></div>
        <div className="flex flex-col md:flex-row md:justify-end gap-2 md:flex-1">
          <SearchComponent setSearch={setSearch} search={search} />
          <CSVModal />
        </div>
      </div>

      {data?.results?.length > 0 ? (
        <DriverTable
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
