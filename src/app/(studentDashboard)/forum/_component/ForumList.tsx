'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useAtom } from 'jotai';
import { MessageCircle, Pin, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import NameInitials from '@/components/NameInitials';
import { toast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { confirmationModalAtom, forumModalAtom, updateStatusModalAtom } from '@/store/modals';
import { Icons } from '@/utils/icon';
import { getInitials } from '@/utils/utils';

import ForumModal from './ForumModal';

const ForumList = ({ data }: any) => {
  const [forumState, setForumState] = useAtom(forumModalAtom);

  const [selectedForumThread, setSelectedForumThread] = useState('');
  const queryClient = useQueryClient();
  const { data: userData } = useSession();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // Track open menu by ID

  const [updateStatusState, setUpdateStatusState] = useAtom(updateStatusModalAtom);
  const [confirmState, setConfirmState] = useAtom(confirmationModalAtom);
  const router = useRouter();
  const { mutate: changeForumStatus, isLoading: changingForumStatus } = useApiMutation<any>({
    endpoint: `/forum-thread/update/${selectedForumThread}`,
    method: 'put',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
        setUpdateStatusState({ status: false, data: null });
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Status updated successfully',
        });
      },
    },
  });

  const { mutate: deleteForumThread, isLoading: deletingForumThread } = useApiMutation({
    method: 'delete',
    endpoint: `/forum-thread/delete/${confirmState?.data?.id}`,
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
          queryKey: ['get-forum-threads'],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.error ?? 'Some error occured',
        });
      },
    },
  });

  const { mutate: favoriteForumThread } = useApiMutation<any>({
    endpoint: `/forum-thread/favorite`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
      },
    },
  });

  const { mutate: unFavForumThread } = useApiMutation<any>({
    endpoint: `/forum-thread/favorite`,
    method: 'delete',
    sendDataInParams: true,
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
      },
    },
  });

  const { mutate: followForumThread } = useApiMutation<any>({
    endpoint: `/forum-thread/subscribe`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
      },
    },
  });

  const { mutate: unFollowForumThread } = useApiMutation<any>({
    endpoint: `/forum-thread/subscribe`,
    method: 'delete',
    sendDataInParams: true,
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-forum-threads'] });
      },
    },
  });

  const renderActions = (data: any) => {
    return (
      <div className="flex flex-col p-2 gap-1 ">
        {userData?.user?.role === 'admin' && (
          <>
            <span
              className="dark-icon text-accent flex gap-2 p-2 font-medium transition-all easy-in duration-400 cursor-pointer hover:text-primary hover:bg-light-hover"
              onClick={(e) => {
                setSelectedForumThread(data.id);
                const payload = {
                  status: data.status === 'inActive' ? 'active' : 'inActive',
                };
                setUpdateStatusState({
                  status: true,
                  data: payload,
                });
                setOpenMenuId(null);
                e.stopPropagation();
              }}
            >
              <Icons iconName="toggle" />
              {changingForumStatus ? 'loading...' : data.status === 'inActive' ? 'Activate' : 'Deactivate'}
            </span>

            <span
              onClick={(e) => {
                setForumState({
                  status: true,
                  data: data,
                });
                setOpenMenuId(null);
                e.stopPropagation();
              }}
              className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
            >
              <Icons iconName="edit" className="w-6 h-6 cursor-pointer" />
              Edit
            </span>

            <span
              onClick={(e) => {
                setConfirmState({
                  status: true,
                  data: data,
                });
                setOpenMenuId(null);
                e.stopPropagation();
              }}
              className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
            >
              <Icons iconName="delete" className="w-6 h-6 cursor-pointer " />
              Delete
            </span>
          </>
        )}
        <span
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          onClick={(e) => {
            const payload = {
              threadId: data.id,
            };
            if (!data.isSubscribed) {
              followForumThread(payload);
            } else {
              unFollowForumThread(payload);
            }
            setOpenMenuId(null);
            e.stopPropagation();
          }}
        >
          <Star />
          {data.isSubscribed ? 'Un follow' : 'Follow'}
        </span>

        <span
          className="dark-icon text-accent flex gap-2  p-2 font-medium transition-all easy-in duration-400 cursor-pointer  hover:text-primary hover:bg-light-hover"
          onClick={(e) => {
            const payload = {
              threadId: data.id,
            };
            if (!data?.isFavorite) {
              favoriteForumThread(payload);
            } else {
              unFavForumThread(payload);
            }
            setOpenMenuId(null);
            e.stopPropagation();
          }}
        >
          <Pin />
          {data.isFavorite ? 'Remove pin' : 'Pin this post'}
        </span>
      </div>
    );
  };

  const onRowClick = (data: any) => {
    router.push(`/forum/${data.id}`);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        {data?.data?.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => onRowClick(item)}
            className={`border-2 relative cursor-pointer ${
              userData?.user?.role === 'admin'
                ? item?.status === 'active'
                  ? 'border-green-400'
                  : 'border-red-400'
                : 'border-gray-300'
            } rounded-2xl p-4 shadow-md bg-white dark:bg-black`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative rounded-full mb-4 md:mb-0 md:w-20 md:h-20">
                <NameInitials initials={getInitials(`${item?.user?.firstName} ${item?.user?.lastName}`)} />
                {item?.isFavorite && (
                  <div className="bg-orange-500 absolute right-0 top-2 z-10 p-1 rounded-full">
                    <Pin className="fill-white stroke-white w-3 h-3" />
                  </div>
                )}
                {item?.isSubscribed && (
                  <div
                    className={`bg-[#FF5722] absolute ${
                      item?.isFavorite ? 'right-3' : 'right-0'
                    }  top-2 z-10 p-1 rounded-full`}
                  >
                    <Star className="fill-white stroke-white w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-gray-700 dark:text-white/90 font-semibold text-xl line-clamp-2 mb-2">
                  {item?.title}
                </p>
                <p className="text-gray-500 dark:text-white/70 text-sm">
                  <span className="font-semibold mr-1 capitalize">{item?.user?.firstName}</span>
                  <span>started {formatDistanceToNow(new Date(item?.createdAt))} ago</span>
                </p>

                <div
                  className="line-clamp-3 text-gray-500 dark:text-white/70 text-sm"
                  dangerouslySetInnerHTML={{ __html: item?.content }}
                ></div>
              </div>

              <div className="flex items-center mt-4 md:mt-0 md:ml-auto">
                <div className="flex gap-1">
                  {item?.ForumComment?.slice(0, 3).map((el: any, index: number) => (
                    <NameInitials
                      key={index}
                      className={`h-8 w-8 font-normal text-xs shadow-sm border border-white ${
                        index > 0 ? '-ml-2' : ''
                      }`}
                      initials={getInitials(`${el?.user?.firstName} ${el?.user?.lastName}`)}
                    />
                  ))}
                  {item?.ForumComment?.length > 3 && (
                    <NameInitials
                      className="h-8 w-8 font-normal text-xs shadow-sm border bg-white -ml-2 text-gray-700"
                      initials={`+${item?.ForumComment?.length - 3}`}
                    />
                  )}
                </div>
                <div className="flex items-center ml-2">
                  <MessageCircle className="text-primary" />
                  <span className="text-gray-500 text-xs ml-1">
                    {`${item?.ForumComment?.length ?? 0} comments`}
                  </span>
                </div>
              </div>

              <div className="md:m-auto">
                <DropdownMenu
                  onOpenChange={(open) => setOpenMenuId(open ? item.id : null)}
                  open={openMenuId === item.id}
                >
                  <DropdownMenuTrigger asChild>
                    <div className="dark-icon rounded w-fit p-1 text-accent transition duration-300 hover:text-primary">
                      <Icons iconName="action" className="h-6 w-6 text-gray rotate-90 cursor-pointer" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white" style={{ zIndex: '99999999' }}>
                    {renderActions(item)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {forumState.status && <ForumModal />}

      {updateStatusState.status && (
        <ConfirmationModal
          open={updateStatusState.status}
          onClose={() => {
            setUpdateStatusState({ status: false, data: null });
            setSelectedForumThread('');
          }}
          title={'Change Status'}
          content={`Are you sure you want to change the status of this forum thread?`}
          primaryAction={{
            label: 'Yes',
            onClick: () => {
              changeForumStatus(updateStatusState.data);
              //setUpdateStatusState({ status: false, data: null });
            },
            loading: changingForumStatus,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => {
              setUpdateStatusState({ status: false, data: null });
              setSelectedForumThread('');
            },
          }}
        />
      )}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => {
            setConfirmState({ status: false, data: null });
          }}
          title={'Delete Forum Thread'}
          content={`Are you sure you want to delete this forum thread?`}
          primaryAction={{
            label: 'Delete',
            onClick: () => {
              deleteForumThread(confirmState.data.id);
              //setUpdateStatusState({ status: false, data: null });
            },
            loading: deletingForumThread,
          }}
          secondaryAction={{
            label: 'Cancel',
            onClick: () => {
              setConfirmState({ status: false, data: null });
            },
          }}
        />
      )}
    </>
  );
};

export default ForumList;
