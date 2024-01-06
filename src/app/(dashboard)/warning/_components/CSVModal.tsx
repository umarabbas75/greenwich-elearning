import { useAtom } from 'jotai';
import { FileDown } from 'lucide-react';
import React from 'react';

import { AlertDestructive } from '@/components/common/FormError';
import UploadCSVModal from '@/components/common/Modal/UploadCSVModal';
import { Button } from '@/components/ui/button';
import { useUploadDriver } from '@/lib/dashboard/client/driver';
import { uploadCsvModal } from '@/store/modals';

const CSVModal = () => {
  const [csvModalState, setCsvModalState] = useAtom(uploadCsvModal);

  const { mutate, error, isError } = useUploadDriver({
    onSuccess: () => {
      setCsvModalState({
        ...csvModalState,
        status: false,
      });
    },
  });
  return (
    <div>
      <Button
        className="flex items-center gap-2"
        onClick={() => {
          setCsvModalState({
            ...csvModalState,
            status: true,
          });
        }}
      >
        <FileDown className="h-6 w-6" />
        Export CSV
      </Button>

      {csvModalState.status && (
        <UploadCSVModal
          error={isError && <AlertDestructive error={error} />}
          title="Warning"
          primaryAction={{
            label: 'Save',
            onClick: (file) => {
              const newFormData = new FormData();
              newFormData.append('file', file as File);
              mutate(newFormData);
            },
          }}
          width="min-w-[45rem]"
        />
      )}
    </div>
  );
};

export default CSVModal;
