/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Remove this
import { Doc, Id } from '../../convex/_generated/dataModel';

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  auhorName?: string;
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
  auhorName = 'Member',
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
  return <div className="">{JSON.stringify(body)}</div>;
};
