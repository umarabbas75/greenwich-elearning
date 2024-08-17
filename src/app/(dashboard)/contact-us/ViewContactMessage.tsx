import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { viewContactMessage } from '@/store/modals';
/* const MAX_FILE_SIZE = 102400; */

const ViewContactMessage = () => {
  const [isModelOpen, setIsModelOpen] = useAtom(viewContactMessage);
  const closeModal = () => {
    setIsModelOpen({
      ...isModelOpen,
      status: false,
      data: null,
    });
  };

  return (
    <Modal
      open={isModelOpen.status}
      onClose={() => {
        closeModal();
      }}
      title={'Message'}
    >
      <p>{isModelOpen.data}</p>
    </Modal>
  );
};

export default ViewContactMessage;
