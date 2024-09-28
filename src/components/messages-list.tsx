import { useState } from 'react';

import { differenceInMinutes, format } from 'date-fns';
import { LoaderIcon } from 'lucide-react';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { GetMessagesReturnType } from '@/features/messages/api/use-get-messages';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { formatDateLabel, TIME_THRESHOLD } from '@/lib/dates';

import { Id } from '../../convex/_generated/dataModel';

import { ChannelHero } from './channel-hero';
import { ConversationHero } from './conversation-hero';
import { Message } from './message';

interface MessagesListProps {
  data: GetMessagesReturnType | undefined;
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessagesList = ({
  data,
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessagesListProps) => {
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
            <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime),
              ) < TIME_THRESHOLD;

            return (
              <Message
                isCompact={isCompact}
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                hideThreadButton={variant === 'thread'}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadName={message.threadName}
                threadTimestamp={message.threadTimestamp}
              />
            );
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(element) => {
          if (element) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 },
            );

            observer.observe(element);
            return () => observer.disconnect();
          }
        }}
      />
      {isLoadingMore && (
        <div className="relative my-2 text-center">
          <hr className="absolute inset-x-0 top-1/2 border-t border-gray-300" />
          <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
            <LoaderIcon className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === 'conversation' && (
        <ConversationHero
          currentMemberId={currentMember?._id}
          name={memberName}
          image={memberImage}
        />
      )}
    </div>
  );
};
