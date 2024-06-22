import { formatDistanceToNow } from 'date-fns';
import { MailOpen } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import Dot from '@/components/common/Dot';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { Icons } from '@/utils/icon';
import { formatDate } from '@/utils/utils';

const Notification = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const onMenuChange = () => {
    setOpenMenu((prev) => !prev);
  };
  const queryClient = useQueryClient();

  const { data: notificationsList } = useApiGet<any>({
    endpoint: `/notifications`,
    queryKey: ['get-notifications'],
    config: {
      select: (res) => res?.data?.data,
      refetchOnWindowFocus: true,
    },
  });
  const showNotificationDot = notificationsList?.filter((item: any) => item?.isRead === false)?.length;

  const { mutate: markAsRead, isLoading: markingAsRead } = useApiMutation({
    method: 'put',
    endpoint: `/notifications/markAsRead`,
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-notifications'],
        });
      },
    },
  });
  console.log({ markingAsRead });

  return (
    <DropdownMenu onOpenChange={onMenuChange} open={openMenu}>
      <DropdownMenuTrigger asChild>
        <div className="dark-icon border relative rounded  p-2 text-accent transition duration-300  hover:bg-dark-icon-hover hover:text-primary">
          <Icons iconName="notification" className="h-6 w-6 cursor-pointer text-accent" />
          {showNotificationDot > 0 && (
            <div className="absolute top-2 right-2">
              <Dot className="w-2 h-2" color={'red'} />
            </div>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[500px] bg-white pb-12" align="end" side="top">
        <div className="p-3">
          <p className="text-base font-bold text-black mb-8">Your Notifications</p>
          <div className="flex gap-4 flex-col">
            {notificationsList?.length > 0 ? (
              notificationsList?.map((item: any, index: any) => {
                if (item?.message === 'A new thread has been created by the admin.') {
                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`flex cursor-pointer items-start gap-2 py-4 px-2 relative ${
                        !item?.isRead ? 'bg-gray-100' : 'bg-white'
                      } `}
                    >
                      <div>
                        <img
                          src={item?.commenter?.photo}
                          className="w-12 h-12 rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between">
                          <p className="text-sm">
                            <b className="mr-1 inline-block">
                              @{item?.commenter?.firstName ?? ''} {item?.commenter?.lastName ?? ''}
                            </b>
                            added a new forum post.
                          </p>
                          {/* <p className="text-sm">read</p> */}
                          {hoveredIndex === index && !item?.isRead && (
                            <div className="text-gray-400 right-4 top-2 absolute transition-all duration-300 cursor-pointer">
                              {/* Your "mark as read" icon */}
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`p-2  hover:bg-gray-200 cursor-pointer rounded-full transition duration-300`}
                                      onClick={() => markAsRead(item)}
                                    >
                                      <MailOpen className="w-4 h-4" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-white">
                                    <p>Mark as read</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">{formatDate(item?.createdAt)}</p>
                          <p className="text-sm text-gray-500">{formatDistanceToNow(item?.createdAt)} ago</p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      key={index}
                      className={`flex cursor-pointer items-start gap-2 py-4 px-2 relative ${
                        !item?.isRead ? 'bg-gray-100' : 'bg-white'
                      } `}
                    >
                      <div>
                        <img
                          src={item?.commenter?.photo}
                          className="w-12 h-12 rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <p className="text-sm">
                              <b className="mr-1 inline-block">
                                @{item?.commenter?.firstName ?? ''} {item?.commenter?.lastName ?? ''}
                              </b>
                              commented on a post you follow.
                            </p>
                            {hoveredIndex === index && !item?.isRead && (
                              <div className="text-gray-400 right-4 top-2 absolute transition-all duration-300 cursor-pointer">
                                {/* Your "mark as read" icon */}
                                <TooltipProvider delayDuration={0}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`p-2  hover:bg-gray-200 cursor-pointer rounded-full transition duration-300`}
                                        onClick={() => markAsRead(item)}
                                      >
                                        <MailOpen className="w-4 h-4" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white">
                                      <p>Mark as read</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">{formatDate(item?.createdAt)}</p>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(item?.createdAt)} ago
                            </p>
                          </div>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-xl text-sm line-clamp-2">{item?.message}</div>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Icons iconName="bell" className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-lg font-semibold text-gray-700">No Notifications</p>
                <p className="mt-2 text-sm text-gray-500">{`You're all caught up!`}</p>
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
