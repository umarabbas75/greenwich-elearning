import { FC } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import LoadingButton from '../LoadingButton';

type Props = {
  title: string | React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  primaryAction?: {
    label: string;
    loading: boolean;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  width?: string; // Add the width prop
  className?: string; // Add the width prop
};

const Index: FC<Props> = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  width = 'min-w-[90%] md:min-w-[55rem]  md:m-0',
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${width} ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-200 h-[1px] w-full absolute top-[64px]"></div>
        <div className="mt-7">{children}</div>
        <DialogFooter>
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

export default Index;
