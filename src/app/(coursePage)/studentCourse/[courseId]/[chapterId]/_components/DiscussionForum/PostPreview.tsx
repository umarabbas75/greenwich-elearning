import { formatDistanceToNow } from 'date-fns';
import { useAtom } from 'jotai';
import { Edit, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, createNewPostModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';

import NewPostModal from './NewPostModal';

const PostPreview = ({ onClick, item }: any) => {
  const queryClient = useQueryClient();
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const [newPostModalState, setCreateNewPostModalAtom] = useAtom(createNewPostModalAtom);
  const session = useSession();
  // const { mutate: editPost, isLoading: editingPost } = useApiMutation<any>({
  //   endpoint: `/post/${item?.id}`,
  //   method: 'put',
  //   config: {
  //     onSuccess: () => {
  //       // setCommentValue('');
  //       // setEditComment(null);
  //       queryClient.invalidateQueries({ queryKey: ['posts'] });

  //       // toast({
  //       //   variant: 'success',
  //       //   // title: 'Success ',
  //       //   description: 'Record added successfully',
  //       // });
  //     },
  //   },
  // });

  const { mutate: deletePost, isLoading: deletingPost } = useApiMutation({
    method: 'delete',
    endpoint: `/courses/post/${confirmState?.data?.id}`,
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
          description: 'Data deleted successfully',
        });
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    },
  });
  return (
    <>
      <div
        onClick={onClick}
        className="bg-white  max-w-[28.5rem] mb-4 p-4 cursor-pointer"
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.35)' }}
      >
        <div className="flex justify-between items-center">
          <div className="">
            <h5 className="text-[#36394D] text-base font-semibold mb-1">{item?.title}</h5>
            <div className="flex gap-1 items-center">
              <Icons iconName="reply" />
              <span className="uppercase text-xs font-medium">{`${item?.user?.firstName ?? ''} ${
                item?.user?.lastName ?? ''
              }`}</span>
              <span className="uppercase text-[9px]">
                {item?.createdAt ? formatDistanceToNow(new Date(item?.createdAt)) : '---'} ago
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold flex justify-center items-center w-8 h-8 rounded-sm mr-4 text-[#36394D] bg-[#CACCD6]">
            {item?.comments?.length}
          </div>
        </div>
        <div className="mt-2 flex justify-end px-4">
          {session.data?.user?.role === 'admin' && (
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700 ">
                <Edit
                  className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateNewPostModalAtom({
                      data: item,
                      status: true,
                    });
                  }}
                />
              </button>
              <button className="text-gray-500 hover:text-red-600">
                <Trash
                  className="h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();

                    setConfirmState({
                      status: true,
                      data: item,
                    });
                  }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
      {newPostModalState.status && <NewPostModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Post'}
          content={`Are you sure you want to delete this post?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deletePost(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingPost,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => setConfirmState({ status: false, data: null }),
          }}
        />
      )}
    </>
  );
};

export default PostPreview;
