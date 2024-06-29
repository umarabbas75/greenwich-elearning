'use client';

import { useAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { addSectionModalAtom } from '@/store/modals';

import SectionModal from './_components/SectionModal';
import SectionTable from './_components/SectionTable';
export type Section = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  shortDescription: string;
};

export type SectionsDataResponse = {
  message: string;
  statusCode: number;
  data: Section[];
};
const Page = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();
  const params = useParams();
  const { chapterId } = params || {};
  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [sectionModalState, setSectionModalState] = useAtom(addSectionModalAtom);

  const { data: sectionsData, isLoading } = useApiGet<SectionsDataResponse, Error>({
    endpoint: `/courses/module/chapter/allSections/${chapterId}`,
    queryKey: ['get-sections', chapterId],
  });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start">
          <p
            className="text-gray-500 flex gap-1 text-sm cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft />
            Back
          </p>
        </div>
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
              Add Lessons
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}

      {sectionsData && sectionsData?.data?.length > 0 ? (
        <SectionTable
          data={sectionsData}
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

      {sectionModalState.status && <SectionModal />}
    </div>
  );
};

export default Page;
