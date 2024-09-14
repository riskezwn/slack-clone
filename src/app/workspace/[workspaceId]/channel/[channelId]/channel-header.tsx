import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { ChevronDown, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useChannelId } from '@/hooks/use-channel-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

export const updateChannelSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
});

type UpdateChannelSchema = z.infer<typeof updateChannelSchema>;

interface ChannelHeaderProps {
  title: string;
}

export const ChannelHeader = ({ title }: ChannelHeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [openEdit, setOpenEdit] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm();

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;

    setOpenEdit(value);
  };

  const form = useForm<UpdateChannelSchema>({
    resolver: zodResolver(updateChannelSchema),
    defaultValues: {
      name: title,
    },
  });

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

    form.setValue('name', value);
  };

  const handleUpdate = (values: UpdateChannelSchema) => {
    updateChannel(
      { id: channelId, name: values.name },
      {
        onSuccess() {
          toast.success('Channel updated');
          setOpenEdit(false);
        },
        onError() {
          toast.error('Failed to update');
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm(
      'Delete this channel?',
      'You are about to delete this channel. This action is irreversible.',
    );

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess() {
          toast.success('Channel deleted');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error('Failed to delete channel');
        },
      },
    );
  };

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <ChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle># {title}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={openEdit} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === 'admin' && (
                      <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          onChange={handleChangeName}
                          autoFocus
                          disabled={isUpdatingChannel}
                          placeholder="e.g. plan-budget"
                        />
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatingChannel}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingChannel}>Save</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                onClick={handleRemove}
                disabled={isRemovingChannel}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-rose-100 px-5 py-4 text-rose-600 hover:bg-rose-200/70"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
