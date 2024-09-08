import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

export const updateWorkspaceSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
});

type UpdateWorkspaceSchema = z.infer<typeof updateWorkspaceSchema>;

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
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This action is irreversible.',
  );

  const [openEdit, setOpenEdit] = useState(false);

  const form = useForm<UpdateWorkspaceSchema>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialValue,
    },
  });

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (values: UpdateWorkspaceSchema) => {
    updateWorkspace(
      {
        id: workspaceId,
        name: values.name,
      },
      {
        onSuccess() {
          toast.success('Workspace updated');
          setOpenEdit(false);
        },
        onError() {
          toast.error('Failed to update workspace');
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    console.log(ok);

    if (!ok) return;

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess() {
          toast.success('Workspace removed 😢');
          router.replace('/');
        },
        onError() {
          toast.error('Failed to remove workspace');
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          form.reset();
        }}
      >
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle>{initialValue}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{initialValue}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          autoFocus
                          disabled={isUpdatingWorkspace}
                          placeholder="Workspace name, e.g. 'Work', 'Personal', 'Home'"
                        />
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={isUpdatingWorkspace}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingWorkspace}>Update</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-red-100 px-5 py-4 text-rose-600 hover:bg-red-200/70"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
