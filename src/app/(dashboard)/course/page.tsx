'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';

import CourseTable from './_components/CourseTable';
export type Course = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  duration: string;
  modules: any;
};
export type CoursesDataResponse = {
  message: string;
  statusCode: number;
  data: Course[];
};
const Page = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);

  const { data: coursesData, isLoading } = useApiGet<CoursesDataResponse, Error>({
    endpoint: `/courses`,
    queryKey: ['get-courses'],
  });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
        <div className="col-span-2  md:col-span-1 ">
          <div className="flex justify-end  gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                // setCourseModalState({
                //   status: true,
                //   data: null,
                // })
                router.push('/course/addCourse')
              }
            >
              Add Course
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}
      {/* <CourseTable
        data={{
          results: tempData,
          count: 10,
          previous: null,
          next: null,
        }}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={false}
      /> */}
      {coursesData && coursesData?.data?.length > 0 ? (
        <CourseTable
          data={coursesData}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <div className="flex item-center justify-center mt-4">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
            {/* <Database /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
