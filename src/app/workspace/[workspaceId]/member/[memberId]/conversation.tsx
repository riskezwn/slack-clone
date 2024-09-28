import { LoaderIcon, TriangleAlertIcon } from 'lucide-react';

import { MessagesList } from '@/components/messages-list';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { useMemberId } from '@/hooks/use-member-id';
import { usePanel } from '@/hooks/use-panel';

import { Id } from '../../../../../../convex/_generated/dataModel';

import { ChatInput } from './chat-input';
import { ConversationHeader } from './conversation-header';

interface ConversationProps {
  id: Id<'conversations'>;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-1">
        <TriangleAlertIcon className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Member not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ConversationHeader
        memberName={member.user.name}
        memberImage={member.user.image}
        onClick={() => onOpenProfile(member._id)}
      />
      <MessagesList
        data={results}
        variant="conversation"
        memberName={member.user.name}
        memberImage={member.user.image}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Message ${member.user.name}`} conversationId={id} />
    </div>
  );
};
