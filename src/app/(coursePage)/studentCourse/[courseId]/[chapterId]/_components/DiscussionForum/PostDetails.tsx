import { formatDistanceToNow } from 'date-fns';
import { useAtom } from 'jotai';
import { ArrowLeft, Edit, Send, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import { getNameInitials } from '@/utils/utils';

const PostDetails = ({ showPostDetails, setShowPostDetails, setShowDiscussion }: any) => {
  console.log({ showPostDetails });
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const [comment, setComment] = useState('');
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const session = useSession();
  const [editComment, setEditComment] = useState<any>(null);
  const [editCommentValue, setEditCommentValue] = useState('');
  const { data: postComments, isLoading: fetchingPostComments } = useApiGet<any>({
    endpoint: `/courses/postComment/${showPostDetails?.id}`,
    queryKey: ['postComment', showPostDetails?.id],
    config: {
      enabled: !!showPostDetails?.id,
    },
  });

  const { mutate: replyOnPost, isLoading: replyingOnPost } = useApiMutation({
    method: 'post',
    endpoint: `/courses/postComment/${showPostDetails?.id}`,
    config: {
      onSuccess: () => {
        setComment('');
        toast({
          variant: 'success',
          title: 'Success ',
          description: 'Data saved successfully',
        });
        queryClient.invalidateQueries({
          queryKey: ['postComment', showPostDetails?.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['posts', courseId],
        });
      },
    },
  });

  const { mutate: editCommentReplyApi, isLoading: editingCommentReply } = useApiMutation<any>({
    endpoint: `/courses/postComment/${showPostDetails?.id}/${editComment?.id}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['postComment', showPostDetails?.id] });
        setEditComment(null);
        setComment('');
        setEditCommentValue('');

        // toast({
        //   variant: 'success',
        //   // title: 'Success ',
        //   description: 'Record added successfully',
        // });
      },
    },
  });

  const { mutate: deletePostReply, isLoading: deletingPostReply } = useApiMutation({
    method: 'delete',
    endpoint: `/courses/postComment/${showPostDetails?.id}/${confirmState?.data?.id}`,
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
        queryClient.invalidateQueries({ queryKey: ['postComment', showPostDetails?.id] });
      },
    },
  });

  console.log({ postComments, fetchingPostComments });
  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => {
              setShowPostDetails(null);
            }}
          />
        </div>
        <div className="line-clamp-1">{showPostDetails.title}</div>
        <Icons
          iconName="close"
          className="cursor-pointer"
          onClick={() => {
            setShowDiscussion(false);
          }}
        />
      </div>

      <div
        className="bg-white max-w-[28.5rem] mb-4 p-4 "
        style={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.35)' }}
      >
        <div className="flex justify-between items-center">
          <h5 className="text-[#36394D] text-base font-semibold mb-1">{showPostDetails?.title}</h5>
          <p className="text-gray-400 text-[10px] uppercase">
            {formatDistanceToNow(new Date(showPostDetails?.createdAt))} AGO
          </p>
        </div>
        <div
          className="text-gray-800 text-sm"
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: showPostDetails?.content }}
        ></div>

        <div className="mt-4">
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 text-sm rounded-full flex items-center justify-center bg-[#36394D] text-white uppercase font-semibold">
              {getNameInitials(`${showPostDetails?.user?.firstName} ${showPostDetails?.user?.lastName}`)}
            </div>
            <p className="text-[36394D] font-semibold">{`${showPostDetails?.user?.firstName} ${showPostDetails?.user?.lastName}`}</p>
          </div>
        </div>

        {/* <hr className="mt-5" /> */}
      </div>
      <p className="mt-5 font-medium text-primary mb-2">{postComments?.data?.length} replies</p>

      <div>
        {postComments?.data?.map((item: any) => {
          return (
            <div key={item.id} className="bg-white shadow-md rounded-md p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icons iconName="customer" className="w-10 h-10 cursor-pointer text-accent" />
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold text-gray-800">{`${item?.user?.firstName} ${item?.user?.lastName}`}</div>
                    <div className="text-gray-600 text-sm">
                      {formatDistanceToNow(new Date(item?.createdAt))} ago
                    </div>
                  </div>
                </div>
                {session?.data?.user?.role === 'admin' && (
                  <div className="flex items-center">
                    <button className="text-gray-500 hover:text-gray-700 mr-2">
                      <Edit
                        className="h-4 w-4"
                        onClick={() => {
                          setEditCommentValue(item?.content);
                          setEditComment(editComment?.id ? null : item);
                        }}
                      />
                    </button>
                    <button className="text-gray-500 hover:text-red-600">
                      <Trash
                        className="h-4 w-4"
                        onClick={() => {
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
              <div className="text-gray-700">
                {editComment?.id && editComment?.id === item?.id ? (
                  ''
                ) : (
                  <p className="text-sm">{item?.content}</p>
                )}
                {editComment?.id && editComment?.id === item?.id && (
                  <div className="relative">
                    <Input
                      value={editCommentValue}
                      // size="sm"
                      onChange={(e) => {
                        setEditCommentValue(e.target.value);
                      }}
                    />
                    <div
                      className="absolute  top-1/2 -translate-y-1/2 right-3 cursor-pointer p-2 rounded-full hover:bg-gray-300 flex justify-center items-center transition-all duration-300"
                      onClick={() => {
                        if (!editingCommentReply) {
                          const payload = {
                            //threadId: editComment?.id,
                            content: editCommentValue,
                          };
                          editCommentReplyApi(payload);
                        }
                      }}
                    >
                      {editingCommentReply ? 'loading....' : <Send className="w-4 h-4" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className=" p-4 rounded-xl border bg-white">
        <div className="flex gap-2 items-start ">
          <Icons iconName="customer" className="w-16 h-16 cursor-pointer text-accent" />
          <div className="flex-1 flex flex-col gap-4">
            <Textarea
              value={comment}
              rows={4}
              placeholder="Type here to reply"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <Button
              className="w-fit"
              onClick={() => {
                if (!replyingOnPost) {
                  const payload = {
                    content: comment,
                  };
                  replyOnPost(payload);
                }
              }}
            >
              {replyingOnPost ? 'saving...' : 'Reply'}
            </Button>
          </div>
        </div>
      </div>

      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Delete Comment'}
          content={`Are you sure you want to delete this reply?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deletePostReply(confirmState.data.id);
              //setConfirmState({ status: false, data: null });
            },
            loading: deletingPostReply,
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

export default PostDetails;
