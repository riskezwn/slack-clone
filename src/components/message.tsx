import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import { useConfirm } from '@/hooks/use-confirm';
import { usePanel } from '@/hooks/use-panel';
import { cn, getNameFirstLetter } from '@/lib/utils';

import { Doc, Id } from '../../convex/_generated/dataModel';

import { Hint } from './hint';
import { MessageReactions } from './message-reactions';
import { MessageToolbar } from './message-toolbar';
import { ThreadBar } from './thread-bar';
import { Thumbnail } from './thumbnail';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const formatFullTime = (date: Date) =>
  `${
    isToday(date)
      ? 'today'
      : isYesterday(date)
        ? 'yesterday'
        : format(date, 'MMM d, yyyy')
  } at ${format(date, 'h:mm:ss a')}`;

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & { count: number; memberIds: Id<'members'>[] }
  >;
  body: Doc<'messages'>['body'];
  image: string | null | undefined;
  updatedAt: Doc<'messages'>['updatedAt'];
  createdAt: Doc<'messages'>['_creationTime'];
  isEditing: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

export const Message = ({
  id,
  //memberId,
  authorImage,
  authorName = 'Member',
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: MessageProps) => {
  const [ConfirmDialog, confirm] = useConfirm();
  const { onOpenMessage, onClose, parentMessageId } = usePanel();

  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();

  const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction;

  const handleReaction = (value: string) => {
    toggleReaction(
      { value, messageId: id },
      {
        onError() {
          toast.error('Failed to toggle reaction');
        },
      },
    );
  };

  const handleUpdate = async ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess() {
          toast.success('Message updated');
          setEditingId(null);
        },
        onError() {
          toast.error('Failed to update message');
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm(
      'Delete message',
      'Are you sure you want to delete this message? This cannot be undone.',
    );

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess() {
          toast.success('Message deleted');

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError() {
          toast.error('Failed to delete message');
        },
      },
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            isRemovingMessage &&
              'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-[45px] text-center text-sm leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                ) : null}
                <MessageReactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage &&
            'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback name={authorName}>
                {getNameFirstLetter(authorName)}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="size-full ">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                {/* // TODO: Add function */}
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), 'h:mm a')}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <MessageReactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
