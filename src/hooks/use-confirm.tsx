import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const useConfirm = (): [
  () => JSX.Element,
  (title: string, message: string) => Promise<unknown>,
] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
    title: string;
    message: string;
  } | null>(null);

  const confirm = (title: string, message: string) =>
    new Promise((resolve) => {
      setPromise({ resolve, title, message });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>{promise?.title}</DialogTitle>
          <DialogDescription>{promise?.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
