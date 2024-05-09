'use client';

import { useAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { addChapterModalAtom, unAssignQuizModalAtom, viewAssignedQuizzesModal } from '@/store/modals';

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
  const router = useRouter();
  const [confirmState, setConfirmState] = useAtom(unAssignQuizModalAtom);
  const [viewAssignQuizModalState] = useAtom(viewAssignedQuizzesModal);
  const queryClient = useQueryClient();

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
  const { mutate: unAssignQuiz, isLoading: unAssigning } = useApiMutation({
    method: 'put',
    endpoint: `/quizzes/user/unAssignQuiz`,
    config: {
      onSuccess: () => {
        setConfirmState({
          ...confirmState,
          status: false,
          data: null,
        });
        toast({
          variant: 'success',
          title: 'Success ',
          description: 'Course unassigned successfully',
        });

        queryClient.invalidateQueries({
          queryKey: ['get-chapters', moduleId],
        });
        queryClient.invalidateQueries({
          queryKey: ['get-all-assigned-quizzes', viewAssignQuizModalState?.data?.id],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.error ?? 'Some error occurred',
        });
      },
    },
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
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Unassign quiz'}
          content={`Are you sure you want to unassign this quiz?`}
          primaryAction={{
            label: 'Unassign',
            onClick: () => {
              const payload = {
                chapterId: viewAssignQuizModalState?.data?.id,
                quizId: confirmState?.data?.id,
              };
              unAssignQuiz(payload);
            },
            loading: unAssigning,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setConfirmState({ status: false, data: null }),
          }}
        />
      )}
    </div>
  );
};

export default Page;
