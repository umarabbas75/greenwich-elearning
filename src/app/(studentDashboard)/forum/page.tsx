'use client';

import Error from 'next/error';
import { useState } from 'react';

import { useApiGet } from '@/lib/dashboard/client/user';

import ForumTable from './_component/ForumTable';

const Page = () => {
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
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
      </div>
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
    </div>
  );
};

export default Page;
