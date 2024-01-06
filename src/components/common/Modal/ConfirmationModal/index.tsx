import { FC } from 'react';

import LoadingButton from '@/components/common/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
type Props = {
  title: string | React.ReactNode;
  content: React.ReactNode;
  open: boolean;

  onClose: () => void;
  primaryAction?: {
    label: string;
    loading?: boolean;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

const ConfirmationModal: FC<Props> = ({
  open,
  onClose,
  title,
  content,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[90%] md:min-w-[55rem]  md:m-0">
        <DialogHeader className="pb-3">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter className="flex gap-2">
          {secondaryAction?.onClick && (
            <Button variant={'outline'} onClick={secondaryAction?.onClick}>
              {secondaryAction?.label || 'Cancel'}
            </Button>
          )}
          {primaryAction?.onClick && (
            <LoadingButton
              loading={primaryAction?.loading}
              onClick={primaryAction?.onClick}
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

export default ConfirmationModal;
