import { useAtom } from 'jotai';

import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { lockedContentModal } from '@/store/modals';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
/* const MAX_FILE_SIZE = 102400; */

const LockedContentModal = () => {
  const [lockedContentModalState, setLockedContentModalState] = useAtom(lockedContentModal);

  return (
    <>
      <Modal
        open={lockedContentModalState.status}
        onClose={() => {
          setLockedContentModalState({ data: null, status: false });
        }}
        title={'Content Locked'}
        className="min-w-[90%] w-full md:min-w-[35rem]  md:m-0"
      >
        <>
          <div className=" flex items-center justify-center z-50">
            <div className="bg-white p-6   max-w-lg w-full">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">🔒 Oops! You Can not Access This Yet</h2>
              </div>

              <div className="flex justify-center items-center mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="h-12 w-12 text-yellow-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    <span className="text-2xl font-medium text-gray-700">Almost There!</span>
                  </div>
                  <p className="text-center text-gray-500 text-md">
                    You need to finish the previous content to unlock this section. Keep up the good work!
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setLockedContentModalState({ status: false, data: null })}
                className="w-full py-2 px-6  text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
              >
                Got it! I’ll Complete the Previous Section
              </Button>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default LockedContentModal;
