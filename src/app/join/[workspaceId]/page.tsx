'use client';

import { useEffect, useMemo, useState } from 'react';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useJoin } from '@/features/workspaces/api/use-join';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const JoinPage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState('');

  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = () => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess(id) {
          toast.success('Workspace joined!');
          router.replace(`/workspace/${id}`);
        },
        onError() {
          toast.error('Failed to join workspace');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src="/vercel.svg" width={60} height={60} alt="logo" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-muted-foreground">Enter the workspace code to join</p>
        </div>
        <InputOTP
          autoFocus
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          onComplete={handleComplete}
          disabled={isPending}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} autoFocus />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
