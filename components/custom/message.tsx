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
      // Set cursor to end of text only when entering edit mode
      const textarea = textareaRef.current;
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Separate effect for adjusting height when content changes
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [editedContent, isEditing]);

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
                    }}
                    onKeyDown={(e) => {
                      // Handle keyboard shortcuts
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSave();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setIsEditing(false);
                      }
                      // Allow spacebar and enter to work normally for editing
                    }}
                    className="w-full resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden text-zinc-700 dark:text-zinc-900 leading-7"
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
                  <Markdown className="prose prose-zinc dark:prose-invert max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:leading-tight [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:leading-tight [&_h3]:text-lg [&_h3]:font-normal [&_h3]:text-zinc-900 [&_h3]:!dark:text-black [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:leading-tight [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:my-4 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:pl-6 [&_li]:mb-1 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:dark:border-zinc-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-zinc-100 [&_code]:dark:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-zinc-100 [&_pre]:dark:bg-zinc-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_em]:italic">{content as string}</Markdown>
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
