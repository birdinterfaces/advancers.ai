'use client';

import { Attachment, ToolInvocation } from 'ai';
import { motion } from 'framer-motion';
import { PencilIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { Markdown } from './markdown';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
  onEdit,
  id,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  onEdit?: (messageId: string, newContent: string) => Promise<boolean>;
  id?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content as string);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!onEdit || !id) {
      toast.error('Cannot edit message');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onEdit(id, editedContent);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content as string);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      adjustTextareaHeight();
      // Set cursor to end of text
      const textarea = textareaRef.current;
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isEditing, editedContent]);

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div className={cn(
        "flex gap-4 w-full relative",
        isEditing 
          ? "group-data-[role=user]/message:w-full group-data-[role=user]/message:max-w-3xl" 
          : "group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
        "group-data-[role=user]/message:py-3.5 group-data-[role=user]/message:px-5 group-data-[role=user]/message:bg-muted rounded-xl"
      )}>
        {role === 'assistant' && (
          <img
            src="/images/blur.png"
            alt="Assistant Icon"
            className="size-8 flex items-center rounded-full justify-center shrink-0"
            style={{ filter: 'blur(4.5px)' }}
            draggable={false}
          />
        )}
        
        {role === 'user' && !isEditing && (
          <div className="absolute -bottom-[5px] -right-0 translate-y-full flex gap-1 opacity-0 group-hover/message:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="size-6 p-0"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="size-3 opacity-80" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="size-6 p-0"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon className="size-3 text-green-500" />
              ) : (
                <CopyIcon className="size-3 -scale-x-100 opacity-80" />
              )}
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full min-w-0">
          {content && (
            <div className="flex flex-col gap-4 w-full min-w-0">
              {isEditing ? (
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={editedContent}
                    onChange={(e) => {
                      setEditedContent(e.target.value);
                      adjustTextareaHeight();
                    }}
                    className="w-full resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden text-zinc-700 dark:text-zinc-300 leading-7"
                    style={{ minHeight: 'auto', height: 'auto' }}
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className="flex gap-1 mt-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full min-w-0">
                  <Markdown className="dark:text-zinc-300 text-zinc-700 [&_h1]:dark:text-white [&_h2]:dark:text-white [&_h3]:dark:text-white [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_p]:leading-7 [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4">{content as string}</Markdown>
                </div>
              )}
            </div>
          )}

          {toolInvocations && toolInvocations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : null}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId} className="skeleton">
                      {toolName === 'getWeather' ? <Weather /> : null}
                    </div>
                  );
                }
              })}
            </div>
          ) : null}

          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                  className="shrink-0"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
