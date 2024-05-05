'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { addChapterModalAtom } from '@/store/modals';

import ChapterModal from './_components/ChapterModal';
import ChapterTable from './_components/ChapterTable';
export type Chapter = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  quizzes: string;
  sections: any;
  pdfFile: string;
};

export type ChaptersDataResponse = {
  message: string;
  statusCode: number;
  data: Chapter[];
};
const Page = ({ params }: { params: { moduleId: string } }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const moduleId = params.moduleId;

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [chapterModalState, setChapterModalState] = useAtom(addChapterModalAtom);
  const { data: chaptersData, isLoading } = useApiGet<ChaptersDataResponse, Error>({
    endpoint: `/courses/module/allChapters/${moduleId}`,
    queryKey: ['get-chapters', moduleId],
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
                setChapterModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Elements
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}

      {chaptersData && chaptersData?.data?.length > 0 ? (
        <ChapterTable
          data={chaptersData}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
          moduleId={moduleId}
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

      {chapterModalState.status && <ChapterModal />}
    </div>
  );
};

export default Page;
