import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { createNewPostModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import NewPostModal from './NewPostModal';
import PostDetails from './PostDetails';
import PostPreview from './PostPreview';

const DiscussionForum = ({ allPosts, setShowDiscussion }: any) => {
  const params = useParams();
  const courseId = params.slug?.[0] || '';
  const [showPostDetails, setShowPostDetails] = useState<any>(null);
  const [newPostModalState, setCreateNewPostModalAtom] = useAtom(createNewPostModalAtom);
  return (
    <div className="max-w-sm w-96 right-0 bottom-0 top-0 overflow-y-scroll max-h-[95vh]">
      {!showPostDetails?.id && (
        <>
          <div className="flex justify-between mb-6">
            <div></div>
            <div>{allPosts?.length} Discussions</div>
            <Icons
              iconName="close"
              className="cursor-pointer dark:[&>g>g]:fill-white"
              onClick={() => {
                setShowDiscussion(false);
              }}
            />
          </div>

          <Button
            className="w-full text-sm mb-4"
            onClick={() => {
              setCreateNewPostModalAtom({
                data: { courseId },
                status: true,
              });
            }}
          >
            CREATE NEW POST
          </Button>

          {allPosts?.map((item: any) => {
            return (
              <PostPreview
                key={item?.id}
                onClick={() => {
                  setShowPostDetails(item);
                }}
                item={item}
              />
            );
          })}
        </>
      )}
      {showPostDetails?.id && (
        <PostDetails
          showPostDetails={showPostDetails}
          setShowPostDetails={setShowPostDetails}
          setShowDiscussion={setShowDiscussion}
        />
      )}

      {newPostModalState?.status && <NewPostModal />}
    </div>
  );
};

export default DiscussionForum;
