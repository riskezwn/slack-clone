import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { useCreateChannel } from '../api/use-create-channel';
import { useCreateChannelModal } from '../store/use-create-channel-modal';

export const createChannelSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
});

type CreateChannelSchema = z.infer<typeof createChannelSchema>;

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { mutate, isPending } = useCreateChannel();

  const form = useForm<CreateChannelSchema>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

    form.setValue('name', value);
  };

  const handleClose = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = (values: CreateChannelSchema) => {
    mutate(
      { name: values.name, workspaceId },
      {
        onSuccess() {
          toast.success('New channel created!');
          // TODO: Redirect to new channel
          handleClose();
        },
        onError() {
          toast.error('Failed to create channel');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={handleChangeName}
                  autoFocus
                  disabled={isPending}
                  placeholder="e.g. plan-budget"
                />
              )}
            />
            <DialogFooter>
              <Button disabled={isPending}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
