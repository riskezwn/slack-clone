'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Loader, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getNameFirstLetter } from '@/lib/utils';

import { useCurrentUser } from '../api/use-current-user';

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (!user) return null;

  const { name, image } = user;

  const avatarFallback = getNameFirstLetter(name!);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 rounded-md transition hover:opacity-75">
          <AvatarImage className="rounded-md" alt={name} src={image} />
          <AvatarFallback name={name}>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={signOut} className="h-10">
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
