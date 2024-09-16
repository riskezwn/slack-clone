'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

import { useCreateWorkspace } from '../api/use-create-workspace';

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
});

type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();

  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async ({ name }: CreateWorkspaceSchema) => {
    mutate(
      {
        name,
      },
      {
        onSuccess(id) {
          toast.success('Workspace created!');
          router.push(`/workspace/${id}`);
          handleClose();
        },
        onError() {
          toast.error('Failed to create workspace');
        },
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
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
                  autoFocus
                  disabled={isPending}
                  placeholder="Workspace name, e.g. 'Work', 'Personal', 'Home'"
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
