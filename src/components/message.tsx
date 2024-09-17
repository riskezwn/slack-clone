/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Remove this
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';

import { getNameFirstLetter } from '@/lib/utils';

import { Doc, Id } from '../../convex/_generated/dataModel';

import { Hint } from './hint';
import { Thumbnail } from './thumbnail';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Renderer = dynamic(() => import('@/components/renderer'));

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
  threadTimestamp?: number;
}

export const Message = ({
  id,
  memberId,
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
  threadTimestamp,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="w-[45px] text-center text-sm leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          <div className="flex w-full flex-col">
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>{getNameFirstLetter(authorName)}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex w-full flex-col overflow-hidden">
          <div className="text-sm">
            {/* // TODO: Add function */}
            <button onClick={() => {}} className="font-bold text-primary hover:underline">
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
        </div>
      </div>
    </div>
  );
};
