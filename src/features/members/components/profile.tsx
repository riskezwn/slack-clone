import {
  XIcon,
  LoaderIcon,
  AlertTriangleIcon,
  MailIcon,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { getNameFirstLetter } from '@/lib/utils';

import { Id } from '../../../../convex/_generated/dataModel';
import { useCurrentMember } from '../api/use-current-member';
import { useGetMember } from '../api/use-get-member';
import { useRemoveMember } from '../api/use-remove-member';
import { useUpdateMember } from '../api/use-update-member';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [ConfirmDialog, confirm] = useConfirm();

  const { data: currentMember, isLoading: currentMemberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });

  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember();

  const isPending = isUpdatingMember || isRemovingMember;

  const onRemove = async () => {
    const ok = await confirm(
      'Remove member',
      'Are you sure you want to remove this member?',
    );

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess() {
          toast.success('Member removed');
          onClose();
        },
        onError() {
          toast.error('Failed to remove member');
        },
      },
    );
  };

  const onLeave = async () => {
    const ok = await confirm(
      'Leave workspace',
      'Are you sure you want to leave this workspace?',
    );

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess() {
          router.replace('/');
          toast.success('You left the workspace');
          onClose();
        },
        onError() {
          toast.error('Failed to leave the workspace');
        },
      },
    );
  };

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirm(
      'Change role',
      "Are you sure you want to change this member's role?",
    );

    if (!ok) return;

    updateMember(
      { id: memberId, role },
      {
        onSuccess() {
          toast.success('Role changed');
        },
        onError() {
          toast.error('Failed to change role');
        },
      },
    );
  };

  if (memberLoading || currentMemberLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <AlertTriangleIcon className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Member not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = getNameFirstLetter(member.user.name || 'Member');

  return (
    <>
      <ConfirmDialog />
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="size-full max-h-[256px] max-w-[256px]">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl" name={member.user.name}>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === 'admin' && currentMember?._id !== memberId ? (
            <div className="mt-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isPending}
                    variant="outline"
                    className="w-full capitalize"
                  >
                    {member.role} <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) => onUpdate(role as 'admin' | 'member')}
                  >
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                disabled={isPending}
                variant="outline"
                className="w-full bg-rose-100 text-rose-600 hover:bg-rose-200/70 hover:text-rose-600"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId && currentMember?.role !== 'admin' ? (
            <div className="mt-4">
              <Button
                onClick={onLeave}
                disabled={isPending}
                variant="outline"
                className="w-full bg-rose-100 text-rose-600 hover:bg-rose-200/70 hover:text-rose-600"
              >
                Leave workspace
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="mb-4 text-sm font-bold">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-muted">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-[#1264a3] hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
