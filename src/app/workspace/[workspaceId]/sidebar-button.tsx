import { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  disabled,
}: SidebarButtonProps) => {
  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col items-center justify-center gap-y-0.5',
        disabled && 'cursor-not-allowed',
      )}
    >
      <Button
        disabled={disabled}
        variant="transparent"
        className={cn(
          'size-9 p-2 group-hover:bg-accent/20',
          isActive && 'bg-accent/20',
          disabled && 'group-hover:bg-transparent',
        )}
      >
        <Icon
          className={cn(
            'size-5 text-white transition-all',
            !disabled && 'group-hover:scale-110',
          )}
        />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent">{label}</span>
    </div>
  );
};
