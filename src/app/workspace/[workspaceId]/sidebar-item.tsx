import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva(
  'flex h-7 items-center justify-start gap-1.5 overflow-hidden px-[18px] text-sm font-normal',
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

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

export const SidebarItem = ({ label, id, icon: Icon, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      className={cn(sidebarItemVariants({ variant }))}
      variant="transparent"
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="mr-1 size-3.5 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
};
