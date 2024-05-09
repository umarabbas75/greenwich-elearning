'use client';

import { useAtom } from 'jotai';
import Error from 'next/error';
import { useState } from 'react';
import { useQueryClient } from 'react-query';

import ConfirmationModal from '@/components/common/Modal/ConfirmationModal';
import SearchComponent from '@/components/common/SearchInput';
import TableSkeletonLoader from '@/components/common/TableSkeletonLoader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { unAssignCourseModalAtom, userModalAtom, viewUserCoursesModal } from '@/store/modals';

import UserModal from './_components/UserModal';
import UserTable from './_components/UserTable';
export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  role: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  courses: string[];
};

export type UsersDataResponse = {
  message: string;
  statusCode: number;
  data: UserData[];
};
const Page = () => {
  const [confirmState, setConfirmState] = useAtom(unAssignCourseModalAtom);

  const [userCoursesState] = useAtom(viewUserCoursesModal);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const [userState, setUserState] = useAtom(userModalAtom);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useApiGet<UsersDataResponse, Error>({
    endpoint: `/users`,
    queryKey: ['get-users'],
  });
  const { mutate: unAssignCourse, isLoading: unAssigning } = useApiMutation({
    method: 'put',
    endpoint: `/courses/unAssignCourse/user`,
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
          description: 'Course unassigned successfully',
        });
        queryClient.invalidateQueries({
          queryKey: ['get-users'],
        });
        queryClient.invalidateQueries({
          queryKey: ['get-user', userCoursesState?.data?.id],
        });
      },
      onError: (data) => {
        toast({
          variant: 'destructive',
          title: 'Error ',
          description: data?.response?.data?.error ?? 'Some error occurred',
        });
      },
    },
  });

  return (
    <div>
      <div className="grid grid-cols-2 my-2 mr-2 items-center">
        <div className="col-span-2 md:col-span-1 flex justify-start"></div>
        <div className="col-span-2  md:col-span-1 ">
          <div className="flex justify-end gap-2">
            <SearchComponent setSearch={setSearch} search={search} />
            <Button
              onClick={() =>
                setUserState({
                  status: true,
                  data: null,
                })
              }
              className="w-fit whitespace-nowrap"
            >
              Add User
            </Button>
          </div>
        </div>
      </div>
      {/* {isError && <AlertDestructive error={error} />} */}

      {usersData && usersData.data && usersData.data.length > 0 ? (
        <UserTable
          data={usersData}
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

      {userState.status && <UserModal />}
      {confirmState.status && (
        <ConfirmationModal
          open={confirmState.status}
          onClose={() => setConfirmState({ status: false, data: null })}
          title={'Unassign Course'}
          content={`Are you sure you want to unassign this course?`}
          primaryAction={{
            label: 'Unassign',
            onClick: () => {
              const payload = {
                userId: userCoursesState?.data?.id,
                courseId: confirmState?.data?.id,
              };
              unAssignCourse(payload);
            },
            loading: unAssigning,
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

export default Page;
