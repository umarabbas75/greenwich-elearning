'use client';

import { useAtom } from 'jotai';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';
import { forumModalAtom } from '@/store/modals';

import ForumModal from './_component/ForumModal';
import ForumTable from './_component/ForumTable';

const Page = () => {
  const [forumState, setForumState] = useAtom(forumModalAtom);
  const { data: userData } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: forumThreads, isLoading } = useApiGet<any, Error>({
    endpoint: `/forum-thread`,
    queryKey: ['get-forum-threads'],
  });
  console.log({ forumThreads });

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="pl-2  my-8 font-medium  text-3xl">News & Announcements Forum</p>
        {userData?.user?.role === 'admin' && (
          <Button
            onClick={() => {
              setForumState({
                data: null,
                status: true,
              });
            }}
          >
            Add New Thread
          </Button>
        )}
      </div>
      <p className="text-gray-600 mb-4">
        This forum will contain news items and important announcements (often concerning examinations). Please
        check this forum regularly for up-to-date information.
      </p>
      {/* {isError && <AlertDestructive error={error} />} */}

      {forumThreads && forumThreads.data && forumThreads.data.length > 0 ? (
        <ForumTable
          data={forumThreads}
          pagination={pagination}
          setPagination={setPagination}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex item-center justify-center mt-4">
          <div className="flex flex-col items-center opacity-70">
            <span>NO DATA FOUND</span>
          </div>
        </div>
      )}

      {forumState.status && <ForumModal />}
    </div>
  );
};

export default Page;
