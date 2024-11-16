import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { viewAccreditation } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const ViewAccreditationModal = () => {
  const [modalState, setModalState] = useAtom(viewAccreditation);
  const closeModal = () => {
    setModalState({
      ...modalState,
      status: false,
      data: null,
    });
  };

  return (
    <Modal
      open={modalState.status}
      onClose={() => {
        closeModal();
      }}
      title={''}
    >
      <img src={modalState.data} alt="Accreditation" />
    </Modal>
  );
};

export default ViewAccreditationModal;
