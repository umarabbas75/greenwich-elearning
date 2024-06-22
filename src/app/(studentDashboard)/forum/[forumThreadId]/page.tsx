'use client';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import NameInitials from '@/components/NameInitials';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { formatDate, getInitials } from '@/utils/utils';

import Comment from './_components/Comment';
import ForumPostSkeletonLoader from './_components/ForumPostSkeletonLoader';

const Page = () => {
  const [comment, setComment] = useState('');
  const params = useParams();
  const router = useRouter();
  const { data: userData } = useSession();
  const { forumThreadId } = params || {};

  const { data: forumData, isLoading: fetchingForumData } = useApiGet<any>({
    endpoint: `/forum-thread/${forumThreadId}`,
    queryKey: ['get-forum-thread', forumThreadId],
    config: {
      enabled: !!forumThreadId,
    },
  });

  const { data: threadComments, isLoading: fetchingThreadComments } = useApiGet<any>({
    endpoint: `/forum-thread-comment/${forumThreadId}`,
    queryKey: ['get-forum-thread-comments', forumThreadId],
    config: {
      enabled: !!forumThreadId,
      select: (res) => res?.data?.data,
    },
  });

  const queryClient = useQueryClient();
  const { title, content, user, createdAt } = forumData?.data || {};
  const { mutate: postComment, isLoading: postingComment } = useApiMutation<any>({
    endpoint: `/forum-thread-comment`,
    method: 'post',
    config: {
      onSuccess: () => {
        setComment('');
        queryClient.invalidateQueries({ queryKey: ['get-forum-thread-comments'] });
      },
    },
  });

  return (
    <div className="pb-20">
      {fetchingForumData ? (
        <ForumPostSkeletonLoader />
      ) : (
        <>
          <div className="flex gap-2 items-center my-4">
            <p
              className="text-gray-500 flex gap-1 text-sm cursor-pointer"
              onClick={() => {
                router.back();
              }}
            >
              <ArrowLeft />
              Back
            </p>
            <p className="pl-2 font-medium text-3xl">News & Announcements Forum</p>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-black mb-4">
            <div className="flex gap-2">
              <div className="w-[80px]">
                <NameInitials
                  className={`w-16 h-16 font-normal shadow-sm border border-white text-2xl`}
                  initials={getInitials(`${user?.firstName} ${user?.lastName ?? ''}`)}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white/80 text-lg">{title}</p>
                <p className="flex gap-2 items-center">
                  <span>by</span>
                  <span className="text-primary">{`${user?.firstName} ${user?.lastName ?? ''}`} </span>
                  <small>{createdAt && formatDate(createdAt)}</small>
                </p>

                <div
                  className="text-[15px]"
                  contentEditable="false"
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>

                <div className="mt-4">
                  {fetchingThreadComments ? 'loading....' : ''}
                  <p className="font-medium">{threadComments?.length} Comments</p>
                  <hr className="my-4" />

                  {threadComments?.map((comment: any) => <Comment key={comment.id} comment={comment} />)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-black">
            <div className="flex gap-2 items-start">
              <NameInitials
                className={`w-16 h-16 font-normal shadow-sm border border-white text-2xl`}
                initials={getInitials(`${userData?.user?.firstName ?? ''} ${userData?.user?.lastName ?? ''}`)}
              />
              <div className="flex-1 flex flex-col gap-4">
                <Textarea
                  value={comment}
                  rows={4}
                  placeholder="Type here to comment"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <Button
                  className="w-fit"
                  onClick={() => {
                    if (!postingComment) {
                      const payload = {
                        content: comment,
                        threadId: forumThreadId,
                      };
                      postComment(payload);
                    }
                  }}
                >
                  {postingComment ? 'saving...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
