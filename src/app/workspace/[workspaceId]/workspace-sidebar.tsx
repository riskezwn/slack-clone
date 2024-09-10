import {
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
  TriangleAlert,
} from 'lucide-react';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { SidebarItem } from './sidebar-item';
import { UserItem } from './user-item';
import { WorkspaceHeader } from './workspace-header';
import { WorkspaceSection } from './workspace-section';

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <TriangleAlert className="size-5 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#5E2C5F]">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizontal} id="drafts" />
      </div>
      <WorkspaceSection label="Channels" hint="New channel" onNew={() => {}}>
        {channelsLoading &&
          channels?.map((channel) => (
            <SidebarItem
              key={channel._id}
              label={channel.name}
              icon={HashIcon}
              id={channel._id}
            />
          ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {!membersLoading &&
          members?.map((item) => (
            <UserItem
              key={item._id}
              id={member._id}
              label={item.user.name}
              image={item.user.image}
            />
          ))}
      </WorkspaceSection>
    </div>
  );
};
