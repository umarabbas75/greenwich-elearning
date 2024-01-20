'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { addModuleModalAtom } from '@/store/modals';

import CourseModal from './_components/ModuleModal';
import CourseTable from './_components/ModuleTable';

const Page = ({ params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;
  console.log({ courseId });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [moduleModalState, setModuleModalState] = useAtom(addModuleModalAtom);

  // const { data, isLoading, error, isError } = useApiCall({
  //   endpoint: `user/auth/${generateQueryString({
  //     page: pagination.pageIndex,
  //     search: debouncedSearch,
  //   })}`,
  //   queryKey: ['get-user', pagination.pageIndex, debouncedSearch],
  // });
  const tempData: any[] = [
    {
      title: 'ED1 - Controlling environmental aspects',
      description: 'ED1 - Controlling environmental aspects',
      status: 'active',
      _id: '3523h5j340932',
    },
    {
      title: 'IDEM2: Environmental regulation',
      description: 'IDEM2: Environmental regulation',
      status: 'active',
      _id: 'df3825jksdfn32',
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
                setModuleModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Modules
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}
      <CourseTable
        data={{
          results: tempData,
          count: 10,
          previous: null,
          next: null,
        }}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={false}
        courseId={courseId}
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

      {moduleModalState.status && <CourseModal />}
    </div>
  );
};

export default Page;
