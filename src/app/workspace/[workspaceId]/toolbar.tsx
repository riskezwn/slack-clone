import { useEffect, useState } from 'react';

import { Info, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useState(false);

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const onChannelClick = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${id}`);
  };

  const onMemberClick = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${id}`);
  };

  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/30"
        >
          <Search className="mr-2 size-4 text-white" />
          <span className="text-xs text-white">
            Press
            <kbd className="pointer-events-none mx-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-[#481349] opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
            to search in {data?.name}
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type to search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  # {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)}>
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
