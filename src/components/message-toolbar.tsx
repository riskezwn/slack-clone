import { useState } from 'react';

import { MessageSquareTextIcon, PencilIcon, SmileIcon, TrashIcon } from 'lucide-react';

import { EmojiPopover } from './emoji-popover';
import { Hint } from './hint';
import { Button } from './ui/button';

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThread,
  handleReaction,
  hideThreadButton,
}: MessageToolbarProps) => {
  const [openEmojiPopover, setOpenEmojiPopover] = useState(false);

  return (
    <div className="absolute right-5 top-0">
      <div className="rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiPopover
          hint="Add reaction"
          open={openEmojiPopover}
          setOpen={setOpenEmojiPopover}
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              onClick={handleThread}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <PencilIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="iconSm"
              disabled={isPending}
            >
              <TrashIcon className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
