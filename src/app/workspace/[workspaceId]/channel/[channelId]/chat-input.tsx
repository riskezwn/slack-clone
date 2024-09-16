import { useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import Quill from 'quill';
import { toast } from 'sonner';

import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body }: { body: string; image: File | null }) => {
    try {
      setIsPending(true);
      await createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        {
          throwError: true,
        },
      );

      setEditorKey((prevKey) => prevKey + 1);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
