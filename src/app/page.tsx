'use client';

import { useEffect, useMemo } from 'react';

import { UserButton } from '@/features/auth/components/user-button';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

const HomePage = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data: workspaces, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

  console.log(open);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log('redirecting to workspace ', workspaceId);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen]);
  return (
    <div>
      <UserButton />
    </div>
  );
};

export default HomePage;
