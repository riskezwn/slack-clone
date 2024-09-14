import React from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { Id } from '../../../../convex/_generated/dataModel';

const userItemVariants = cva(
  'flex h-7 items-center justify-start gap-1.5 overflow-hidden px-4 text-sm font-normal',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'bg-white/90 text-[#481349] hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface UserItemsProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
}

export const UserItem = ({ id, label, image, variant }: UserItemsProps) => {
  const workspaceId = useWorkspaceId();

  const avatarFallback = label?.charAt(0).toUpperCase();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="mr-1 flex size-5 rounded-md">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="flex rounded-md bg-sky-500 text-xs text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};
