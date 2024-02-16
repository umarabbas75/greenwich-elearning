'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { addSectionModalAtom } from '@/store/modals';

import SectionModal from './_components/SectionModal';
import SectionTable from './_components/SectionTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [sectionModalState, setSectionModalState] = useAtom(addSectionModalAtom);

  // const { data, isLoading, error, isError } = useApiCall({
  //   endpoint: `user/auth/${generateQueryString({
  //     page: pagination.pageIndex,
  //     search: debouncedSearch,
  //   })}`,
  //   queryKey: ['get-user', pagination.pageIndex, debouncedSearch],
  // });
  const tempData: any[] = [
    {
      title: 'Element 1: Key Environmental Cycles and the Effects of Human Activity on the Environment.',
      content: '',
      status: 'active',
      _id: '3523hdfdfd5j340932',
    },
    {
      title: 'What will be covered in Learning Outcome 1?',
      content: 'What will be covered in Learning Outcome 1?',
      status: 'active',
      _id: 'sdfds4543cddsssdfc2',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
        <div className="col-span-2  md:col-span-1 ">
          <div className="flex justify-end  gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                setSectionModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Sections
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}
      <SectionTable
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

      {sectionModalState.status && <SectionModal />}
    </div>
  );
};

export default Page;
