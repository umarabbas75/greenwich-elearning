import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { Course } from '@/app/(dashboard)/course/page';
import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import ReactSelect from '@/components/common/ReactSelect';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { assignCoursesModalAtom } from '@/store/modals';

import { CoursesDataResponse } from '../../course/page';
/* const MAX_FILE_SIZE = 102400; */
type UserFormTypes = {
  courses?: string[] | undefined;
};

const AssignCoursesModal = () => {
  const [assignCoursesState, setAssignCoursesState] = useAtom(assignCoursesModalAtom);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: assignCourse,
    isLoading: assigningCourse,
    isError: isAssignError,
    error: assignError,
  } = useApiMutation<any>({
    endpoint: `/courses/assignCourse`,
    method: 'put',
    sendDataInParams: true,
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-users'] });
        closeModal();
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Record added successfully',
        });
      },
    },
  });

  const closeModal = () => {
    setAssignCoursesState({
      ...assignCoursesState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    courses: [],
  };
  const validationSchema = Yup.object().shape({
    courses: Yup.object().required('courses is required'),
  });

  const form = useForm<UserFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control } = form;

  const { data: coursesData, isLoading } = useApiGet<CoursesDataResponse, Error>({
    endpoint: `/courses`,
    queryKey: ['get-courses'],
  });

  const onSubmit = (values: UserFormTypes) => {
    const payload = {
      userId: assignCoursesState?.data.id,
      courseId: values.courses.id,
    };
    assignCourse(payload);
  };

  return (
    <Modal open={assignCoursesState.status} onClose={() => {}} title={'Assign Course'}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {isAssignError && <AlertDestructive error={assignError} />}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <FormLabel>Courses</FormLabel>
                {coursesData && (
                  <Controller
                    name="courses"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelect
                          isMulti={false}
                          options={coursesData.data ?? []}
                          value={value} // Find the matching option by value
                          onChange={(val: Course) => {
                            onChange(val);
                          }}
                          getOptionLabel={(val: Course) => val.title}
                          getOptionValue={(val: Course) => val.id}
                        />
                      );
                    }}
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton loading={assigningCourse} type="submit" variant="default">
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default AssignCoursesModal;
