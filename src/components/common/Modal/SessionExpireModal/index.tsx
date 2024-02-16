import { useAtom } from 'jotai';
import { ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import LoadingButton from '@/components/common/LoadingButton';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { sessionExpireModalAtom } from '@/store/modals';

const SessionExpireModal = () => {
  const [sessionExpire, setSessionExpireModal] = useAtom(sessionExpireModalAtom);
  const [loading, setIsLoading] = useState(false);
  const logutUser = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
    setIsLoading(false);
  };

  return (
    <Dialog
      open={sessionExpire.status}
      onOpenChange={() => {
        setSessionExpireModal({
          ...sessionExpire,
          status: false,
        });
      }}
    >
      <DialogContent
        className="min-w-[90%] md:min-w-[55rem]  md:m-0"
        onEscapeKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
          }
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <ShieldAlert className="h-20 w-20" />

          <h2>Session Expired</h2>
          <p>Your session has expired. Please log in again.</p>
        </div>

        <DialogFooter>
          <LoadingButton loading={loading} onClick={logutUser} variant="default" color="primary">
            Login
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpireModal;
