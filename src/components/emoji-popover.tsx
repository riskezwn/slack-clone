import { useState } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type Emoji = {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
};

interface EmojiPopoverProps {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  hint?: string;
  onEmojiSelect: (emoji: Emoji) => void;
}

export const EmojiPopover = ({
  children,
  open,
  setOpen,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: Emoji) => {
    onEmojiSelect(emoji);
    setOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="border-white/5 bg-black text-white">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-full border-none p-0 shadow-none">
          <Picker theme="light" data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};
