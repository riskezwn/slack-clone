import { ChevronDownIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getNameFirstLetter } from '@/lib/utils';

interface ConversationHeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const ConversationHeader = ({
  memberName,
  memberImage,
  onClick,
}: ConversationHeaderProps) => {
  const avatarFallback = getNameFirstLetter(memberName || '');

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <Button
        variant="ghost"
        className="w-auto overflow-hidden px-2 text-lg font-semibold"
        size="sm"
        onClick={onClick}
      >
        <Avatar className="mr-2 size-6">
          <AvatarImage src={memberImage} />
          <AvatarFallback name={memberName}>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDownIcon className="ml-2 size-2.5" />
      </Button>
    </div>
  );
};
