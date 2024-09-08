import { useState } from 'react';

import { Trash } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [value] = useState(initialValue);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="border-b bg-white p-4">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2 px-4 pb-4">
          <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-sm font-semibold text-[#1264a3] hover:underline">Edit</p>
            </div>
            <p className="text-sm">{value}</p>
          </div>
          <button
            disabled={false}
            onClick={() => {}}
            className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-red-100 px-5 py-4 text-rose-600 hover:bg-red-200/70"
          >
            <Trash className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
