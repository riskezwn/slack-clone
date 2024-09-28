import { useMemberId } from '@/hooks/use-member-id';
import { getNameFirstLetter } from '@/lib/utils';

import { Id } from '../../convex/_generated/dataModel';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ConversationHeroProps {
  currentMemberId?: Id<'members'>;
  name?: string;
  image?: string;
}

export const ConversationHero = ({
  currentMemberId,
  name = 'Member',
  image,
}: ConversationHeroProps) => {
  const memberId = useMemberId();

  const avatarFallback = getNameFirstLetter(name);

  if (currentMemberId === memberId) {
    return (
      <div className="mx-5 mb-4 mt-[88px]">
        <div className="mb-2 flex items-center gap-x-1">
          <p className="text-2xl font-bold">You</p>
        </div>
        <p className="mb-4 font-normal text-slate-800">
          This conversation is just with you. You can use it for taking notes or for
          whatever you need.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14">
          <AvatarImage src={image} />
          <AvatarFallback name={name}>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="mb-4 font-normal text-slate-800">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};
