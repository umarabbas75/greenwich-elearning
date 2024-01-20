'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { addCourseModalAtom } from '@/store/modals';

import { CourseType } from '../../../../types/course.types';

import CourseModal from './_components/CourseModal';
import CourseTable from './_components/CourseTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [courseModalState, setCourseModalState] = useAtom(addCourseModalAtom);

  // const { data, isLoading, error, isError } = useApiCall({
  //   endpoint: `user/auth/${generateQueryString({
  //     page: pagination.pageIndex,
  //     search: debouncedSearch,
  //   })}`,
  //   queryKey: ['get-user', pagination.pageIndex, debouncedSearch],
  // });
  const tempData: CourseType[] = [
    {
      title: 'Nebosh 1',
      description: 'This is desc for nebosh 1',
      status: 'active',
      _id: '123dsf4534we',
    },
    {
      title: 'Nebosh 2',
      description: 'This is desc for nebosh 2',
      status: 'active',
      _id: '123dsf4534we',
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
                setCourseModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Course
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

      {courseModalState.status && <CourseModal />}
    </div>
  );
};

export default Page;
