import { useAtom } from 'jotai';
import Image from 'next/image';

import Modal from '@/components/common/Modal';

//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';

import { qrCodeModalAtom } from '@/store/modals';
const QRCodeModal = () => {
  const [qrCodeModal, setQrCodeModal] = useAtom(qrCodeModalAtom);

  const closeModal = () => {
    setQrCodeModal({
      ...qrCodeModal,
      status: false,
      data: null,
    });
  };

  return (
    <Modal
      open={qrCodeModal.status}
      onClose={() => closeModal()}
      title={<span className=" text-black">QR Code</span>}
      width="min-w-[20rem]"
      className="bg-white dark:bg-white"
    >
      <Image src={qrCodeModal.data} alt="qr image" width={300} height={300} />
    </Modal>
  );
};

export default QRCodeModal;
