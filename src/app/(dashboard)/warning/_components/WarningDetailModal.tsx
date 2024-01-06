import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';

//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';

import { warningDetailAtom } from '@/store/modals';

const WarningDetailModal = () => {
  const [warningState, setWarningState] = useAtom(warningDetailAtom);

  console.log({ warningState });

  const closeModal = () => {
    setWarningState({
      ...warningState,
      status: false,
      data: null,
    });
  };

  const DataDisplay = ({ data }: any) => {
    const entries = Object.entries(data);

    return (
      <div className="grid gap-7 grid-cols-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="capitalize font-bold">{key}</div>
            <div className="capitalize dark:text-gray-100 text-gray-500">
              {value as any}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      open={warningState.status}
      onClose={() => closeModal()}
      title={'Details'}
      width="min-w-[50rem] shadow-2xl"
    >
      <DataDisplay data={warningState.data} />
    </Modal>
  );
};

export default WarningDetailModal;
