'use client';

import { useAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { addModuleModalAtom } from '@/store/modals';

import ModuleModal from './_components/ModuleModal';
import ModuleTable from './_components/ModuleTable';
export type Module = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  chapters: any;
  _count: any;
};

export type ModulesDataResponse = {
  message: string;
  statusCode: number;
  data: Module[];
};
const Page = ({ params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  //const debouncedSearch = useDebounce(search, 500);
  const [moduleModalState, setModuleModalState] = useAtom(addModuleModalAtom);

  const { data: modulesData, isLoading } = useApiGet<ModulesDataResponse, Error>({
    endpoint: `/courses/allModules/${courseId}`,
    queryKey: ['get-modules', courseId],
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
                setModuleModalState({
                  status: true,
                  data: null,
                })
              }
            >
              Add Units
            </Button>
          </div>
        </div>
      </div>

      {modulesData?.data && modulesData?.data?.length > 0 ? (
        <ModuleTable
          data={modulesData}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
          courseId={courseId}
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

      {moduleModalState.status && <ModuleModal courseId={courseId} />}
    </div>
  );
};

export default Page;
