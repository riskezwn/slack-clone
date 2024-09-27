'use client';

import { useEffect } from 'react';

import { AlertTriangleIcon, LoaderIcon } from 'lucide-react';

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';
import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Conversation } from './conversation';

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data, mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          console.log(data);
        },
        onError(error) {
          console.log(error);
        },
      },
    );
  }, [mutate, workspaceId, memberId]);

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2">
        <AlertTriangleIcon className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    );
  }

  return <Conversation id={data._id} />;
};

export default MemberIdPage;
