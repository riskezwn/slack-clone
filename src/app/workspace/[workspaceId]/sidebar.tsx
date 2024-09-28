import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { SidebarButton } from './sidebar-button';
import { WorkspaceSwitcher } from './workspace-switcher';

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pb-4 pt-[9px]">
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive={pathname.includes('workspace')} />
      <SidebarButton disabled icon={MessagesSquare} label="DMs" />
      <SidebarButton disabled icon={Bell} label="Activity" />
      <SidebarButton disabled icon={MoreHorizontal} label="More" />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  );
};
