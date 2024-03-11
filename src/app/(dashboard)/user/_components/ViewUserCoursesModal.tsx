import { useAtom } from 'jotai';

import SingleCourse from '@/app/(studentDashboard)/studentCourses/_components/SingleCourse';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet } from '@/lib/dashboard/client/user';
import { viewUserCoursesModal } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const ViewUserCoursesModal = () => {
  const [userCoursesState, setUserCoursesState] = useAtom(viewUserCoursesModal);
  console.log({ userCoursesState });
  const closeModal = () => {
    setUserCoursesState({
      ...userCoursesState,
      status: false,
      data: null,
    });
  };

  const { data: assignedCourses, isLoading: fetchingUser } = useApiGet<any>({
    endpoint: `/courses/getAllAssignedCourses/${userCoursesState?.data?.id}`,
    queryKey: ['get-user', userCoursesState?.data?.id],
    config: {
      enabled: !!userCoursesState?.data?.id,
    },
  });
  console.log('assignedCourses', assignedCourses?.data);

  return (
    <Modal
      open={userCoursesState.status}
      onClose={() => {
        closeModal();
      }}
      title={'Assigned Courses'}
    >
      {fetchingUser ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap gap-4">
          {assignedCourses?.data?.map((item: any) => {
            return <SingleCourse key={item.id} item={item} />;
          })}
        </div>
      )}
    </Modal>
  );
};

export default ViewUserCoursesModal;
