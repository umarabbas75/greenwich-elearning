'use client';

import { useAtom } from 'jotai';
import Error from 'next/error';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0 mb-4 md:mb-0">
        <p className="md:pl-2  md:my-8 font-medium  text-xl lg:text-3xl">News & Announcements Forum</p>
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
        This forum serves as a central hub for news updates and crucial announcements, particularly those
        pertaining to examinations. Stay informed by regularly checking this space for the latest information
        and important notices. Keep yourself up-to-date with relevant news items and announcements that may
        impact your academic journey.
      </p>
      {/* {isError && <AlertDestructive error={error} />} */}

      {forumThreads && forumThreads.data && forumThreads.data.length > 0 ? (
        <ForumTable
          data={forumThreads}
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

      {forumState.status && <ForumModal />}
    </div>
  );
};

export default Page;
