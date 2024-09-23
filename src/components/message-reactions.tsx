import { useState } from 'react';

import { SmilePlusIcon } from 'lucide-react';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { Doc, Id } from '../../convex/_generated/dataModel';

import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';

interface MessageReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  onChange: (value: string) => void;
}

export const MessageReactions = ({ data, onChange }: MessageReactionsProps) => {
  const workspaceId = useWorkspaceId();

  const [openEmojiPopover, setOpenEmojiPopover] = useState(false);

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="my-1 flex items-center gap-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'h-6 px-2 rounded-full bg-slate-200/20 border border-transparent text-slate-100 flex items-center gap-x-1',
              reaction.memberIds.includes(currentMemberId) &&
                'bg-blue-100/70 border-blue-500 text-white',
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                reaction.memberIds.includes(currentMemberId) && 'text-blue-500',
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        open={openEmojiPopover}
        setOpen={setOpenEmojiPopover}
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500">
          <SmilePlusIcon className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};
