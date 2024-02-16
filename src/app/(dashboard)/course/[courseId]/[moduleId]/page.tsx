'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import { addChapterModalAtom } from '@/store/modals';

import ChapterModal from './_components/ChapterModal';
import ChapterTable from './_components/ChapterTable';

const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [chapterModalState, setChapterModalState] = useAtom(addChapterModalAtom);

  // const { data, isLoading, error, isError } = useApiCall({
  //   endpoint: `user/auth/${generateQueryString({
  //     page: pagination.pageIndex,
  //     search: debouncedSearch,
  //   })}`,
  //   queryKey: ['get-user', pagination.pageIndex, debouncedSearch],
  // });
  const tempData: any[] = [
    {
      title:
        'Element 1: Key Environmental Cycles and the Effects of Human Activity on the Environment 2018.Lesson',
      description:
        'Element 1: Key Environmental Cycles and the Effects of Human Activity on the Environment 2018.Lesson',
      status: 'active',
      _id: '3523hdf5j340932',
    },
    {
      title: 'Element 2: Environmental Leadership 2018.Lesson',
      description: 'Element 2: Environmental Leadership 2018.Lesson',
      status: 'active',
      _id: 'sdfds4543csdfc2',
    },
    {
      title: 'Element 3: Environmental Management Systems & Emergency Planning 2018.Lesson',
      description: 'Element 3: Environmental Management Systems & Emergency Planning 2018.Lesson',
      status: 'active',
      _id: 'sdfds4543csdfc2',
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
                setChapterModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Chapters
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}
      <ChapterTable
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

      {chapterModalState.status && <ChapterModal />}
    </div>
  );
};

export default Page;
