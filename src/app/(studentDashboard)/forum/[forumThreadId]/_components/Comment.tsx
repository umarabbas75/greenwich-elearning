import { useAtom } from 'jotai';
import { Edit, Send, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import NameInitials from '@/components/NameInitials';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom } from '@/store/modals';
import { formatDate, getInitials } from '@/utils/utils';

const Comment = ({ comment }: any) => {
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const { data: userData } = useSession();
  const [editComment, setEditComment] = useState<any>();
  const [commentValue, setCommentValue] = useState('');
  const queryClient = useQueryClient();
  const { mutate: editCommentApi, isLoading: editingComment } = useApiMutation<any>({
    endpoint: `/forum-thread-comment/${editComment?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        setCommentValue('');
        setEditComment(null);
        queryClient.invalidateQueries({ queryKey: ['get-forum-thread-comments'] });

        // toast({
        //   variant: 'success',
        //   // title: 'Success ',
        //   description: 'Record added successfully',
        // });
      },
    },
  });

  const { mutate: deleteComment, isLoading: deletingComment } = useApiMutation({
    method: 'delete',
    endpoint: `/forum-thread-comment/${confirmState?.data?.id}`,
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
          queryKey: ['get-forum-thread-comments'],
        });
      },
    },
  });
  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" /> */}
          {/* <Icons iconName="customer" className="w-10 h-10 cursor-pointer text-accent" /> */}
          <NameInitials
            className={`w-10 h-10 font-normal  shadow-sm border border-white text-sm`}
            initials={getInitials(`${comment?.user?.firstName} ${comment?.user?.lastName}`)}
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-gray-800">{`${comment?.user?.firstName} ${comment?.user?.lastName}`}</div>
            <div className="text-gray-600 text-sm">{formatDate(comment?.createdAt)}</div>
          </div>
        </div>
        {userData?.user?.id === comment?.user?.id && (
          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-gray-700 mr-2"
              onClick={() => {
                setEditComment(editComment?.id ? null : comment);

                setCommentValue(comment?.content);
              }}
            >
              <Edit />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={() => {
                setConfirmState({
                  status: true,
                  data: comment,
                });
              }}
            >
              <Trash />
            </button>
          </div>
        )}
      </div>
      <div className="text-gray-700">
        {!editComment?.id && comment?.content}
        {editComment?.id && (
          <div className="relative">
            <Input
              value={commentValue}
              onChange={(e) => {
                setCommentValue(e.target.value);
              }}
            />
            <div
              className="absolute  top-1/2 -translate-y-1/2 right-3 cursor-pointer p-2 rounded-full hover:bg-gray-300 flex justify-center items-center transition-all duration-300"
              onClick={() => {
                const payload = {
                  //threadId: editComment?.id,
                  content: commentValue,
                };
                editCommentApi(payload);
              }}
            >
              {editingComment ? 'loading....' : <Send className="w-4 h-4" />}
            </div>
          </div>
        )}
      </div>

      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Comment'}
          content={`Are you sure you want to delete this comment?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteComment(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingComment,
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

export default Comment;
