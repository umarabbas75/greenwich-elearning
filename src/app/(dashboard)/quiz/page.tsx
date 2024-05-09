'use client';

import { useAtom } from 'jotai';
import Error from 'next/error';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { userModalAtom } from '@/store/modals';

import QuizModal from './_components/QuizModal';
import QuizTable from './_components/QuizTable';
export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  role: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  courses: string[];
};

export type UsersDataResponse = {
  message: string;
  statusCode: number;
  data: UserData[];
};
const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [userState, setUserState] = useAtom(userModalAtom);

  const { data: quizzesData, isLoading } = useApiGet<any, Error>({
    endpoint: `/quizzes`,
    queryKey: ['get-quizzes'],
  });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
        <div className="col-span-2  md:col-span-1 ">
          <div className="flex justify-end gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              className="whitespace-nowrap"
              onClick={() =>
                setUserState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Quiz
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}

      {quizzesData && quizzesData.data && quizzesData.data.length > 0 ? (
        <QuizTable
          data={quizzesData}
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
          </div>
        </div>
      )}

      {userState.status && <QuizModal />}
    </div>
  );
};

export default Page;
