import { useAtom } from 'jotai';
import { Delete } from 'lucide-react';
import { FC, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import LoadingButton from '@/components/common/LoadingButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { uploadCsvModal } from '@/store/modals';
type Props = {
  title: string | React.ReactNode;
  primaryAction?: {
    label: string;
    loading?: boolean;
    onClick: (file: File | null) => void; // Adjust the type of onClick
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  width?: string; // Add the width prop
  className?: string; // Add the width prop
  error?: React.ReactNode;
};

const UploadCSVModal: FC<Props> = ({
  title,
  primaryAction,
  secondaryAction,
  width = 'min-w-[90%] md:min-w-[55rem]  md:m-0',
  className,
  error,
}) => {
  const [csvModalState, setCsvModalState] = useAtom(uploadCsvModal);
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: File) => {
    setFile(e);
  };
  const onClose = () => {
    setCsvModalState({
      ...csvModalState,
      status: false,
    });
  };
  return (
    <Dialog open={csvModalState.status} onOpenChange={onClose}>
      <DialogContent className={`${width} ${className}`}>
        <DialogHeader className="pb-3">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {error}
        <div className="w-100">
          <FileUploader multiple={false} handleChange={onChange} name="file" value={file} types={['CSV']}>
            <div className="relative w-100 h-100 text-center flex justify-center flex-col items-center p-4 border border-dashed rounded cursor-pointer">
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="inbox"
                width="1em"
                height="1em"
                //fill={primary_color}
                aria-hidden="true"
                className="fill-primary w-20 h-20 text-center"
              >
                <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
              </svg>
              <p style={{ margin: 0, fontWeight: 600 }}>Click or drag file to this area to upload</p>
              <span style={{ color: 'grey' }}>
                You can upload only one file.Only CSV file format is supported.
              </span>
            </div>
          </FileUploader>

          {file?.name && (
            <div className="flex items-center justify-between mt-5 cursor-pointer hover:bg-gray-200 transition duration-300 bg-gray-100 p-2 rounded-sm">
              <span>{`File name: ${file?.name}`}</span>
              <span>
                <Delete
                  className="h-6 w-6 cursor-pointer hover:bg-gray-400 transition duration-300"
                  onClick={() => {
                    setFile(null);
                  }}
                />
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          {secondaryAction?.onClick && (
            <Button variant={'outline'} onClick={secondaryAction?.onClick}>
              {secondaryAction?.label || 'Cancel'}
            </Button>
          )}
          {primaryAction?.onClick && (
            <LoadingButton
              loading={primaryAction?.loading}
              onClick={() => primaryAction?.onClick(file)}
              variant="default"
              color="primary"
            >
              {primaryAction?.label || 'Submit'}
            </LoadingButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadCSVModal;
