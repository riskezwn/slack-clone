import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  ALargeSmallIcon,
  ImageIcon,
  SendHorizonalIcon,
  SmileIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';

import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';

import { Emoji, EmojiPopover } from './emoji-popover';
import { Hint } from './hint';
import { Button } from './ui/button';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  defaultValue = [],
  disabled = false,
  innerRef,
  placeholder = 'Write something...',
}: EditorProps) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isEmojiPopoverVisible, setIsEmojiPopoverVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const onSubmitRef = useRef(onSubmit);
  const onCancelRef = useRef(onCancel);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    onSubmitRef.current = onSubmit;
    onCancelRef.current = onCancel;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());
                onSubmitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const onEmojiSelect = (emoji: Emoji) => {
    const quill = quillRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  };

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm',
          disabled && 'opacity-50',
        )}
      >
        <div ref={containerRef} className="ql-custom h-full" />
        {!!image && (
          <div className="p-2">
            <div className="group/image relative flex size-[62px] items-center justify-center">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className="absolute -right-2.5 -top-2.5 z-[4] hidden size-6 items-center justify-center rounded-full  border-2 border-white bg-black/70 text-white hover:bg-black group-hover/image:flex"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="uploaded"
                fill
                className="overflow-hidden rounded-xl border object-cover"
              />
            </div>
          </div>
        )}
        <div className="z-[5] flex gap-x-1 px-2 pb-2">
          <Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant={isToolbarVisible ? 'outline' : 'ghost'}
              onClick={toggleToolbar}
            >
              <ALargeSmallIcon className="size-4 text-muted-foreground" />
            </Button>
          </Hint>
          <EmojiPopover
            onEmojiSelect={onEmojiSelect}
            open={isEmojiPopoverVisible}
            setOpen={setIsEmojiPopoverVisible}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant={isEmojiPopoverVisible ? 'outline' : 'ghost'}
            >
              <SmileIcon className="size-4 text-muted-foreground" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4 text-muted-foreground" />
              </Button>
            </Hint>
          )}
          {variant === 'create' && (
            <Button
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white text-muted-foreground hover:bg-white'
                  : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
              )}
              disabled={disabled || isEmpty}
              size="iconSm"
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
            >
              <SendHorizonalIcon className="size-4" />
            </Button>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant="outline" size="sm" onClick={onCancel} disabled={false}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                disabled={disabled || isEmpty}
                className="bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition',
            !isEmpty && 'opacity-100',
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
