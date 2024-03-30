import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useApiGet } from '@/lib/dashboard/client/user';
import { viewAssignedQuizzesModal } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const ViewAssignQuizzesModal = () => {
  const [viewAssignQuizModalState, setViewAssignQuizModalState] = useAtom(viewAssignedQuizzesModal);
  console.log({ viewAssignQuizModalState });
  const closeModal = () => {
    setViewAssignQuizModalState({
      ...viewAssignQuizModalState,
      status: false,
      data: null,
    });
  };

  const { data: assignedQuizzes, isLoading: fetchingAssignedQuizzes } = useApiGet<any>({
    endpoint: `/quizzes/getAllAssignQuizzes/${viewAssignQuizModalState?.data?.id}`,
    queryKey: ['get-all-assigned-quizzes', viewAssignQuizModalState?.data?.id],
    config: {
      enabled: !!viewAssignQuizModalState?.data?.id,
    },
  });
  console.log('assignedQuizzes', assignedQuizzes?.data);

  return (
    <Modal
      open={viewAssignQuizModalState.status}
      onClose={() => {
        closeModal();
      }}
      title={'Assigned Courses'}
    >
      {fetchingAssignedQuizzes ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap gap-4">
          {assignedQuizzes?.data?.map((item: any, index: number) => {
            return <h1 key={index}>{'test'}</h1>;
          })}
        </div>
      )}
    </Modal>
  );
};

export default ViewAssignQuizzesModal;
