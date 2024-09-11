import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useNewJoinCode();

  const [isCopied, handleCopyToClipboard] = useCopyToClipboard();
  const [ConfirmDialog, confirm] = useConfirm();

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    handleCopyToClipboard(inviteLink);

    if (isCopied) toast.success('Invite link copied to clipboard');
  };

  const handleNewCode = async () => {
    const ok = await confirm(
      'Are you sure?',
      'This will deactivate the current invite code and generate a new one.',
    );

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess() {
          toast.success('Invite code regenerated');
        },
        onError() {
          toast.error('Failed to regenerate invite code');
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold uppercase tracking-widest">{joinCode}</p>
            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              Copy link
              <CopyIcon className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button disabled={isPending} variant="outline" onClick={handleNewCode}>
              New code
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
