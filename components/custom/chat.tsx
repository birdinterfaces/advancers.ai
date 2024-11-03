'use client';

import { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

import { ChatHeader } from '@/components/custom/chat-header';
import { Message as PreviewMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { Model } from '@/lib/model';

import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { useModal } from '../context/modal-context';

export function Chat({
  id,
  initialMessages,
  selectedModelName,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelName: Model['name'];
}) {
  const { theme } = useTheme();
  const { openModal } = useModal();

  const { messages, append, reload, stop, isLoading, input, setInput, handleSubmit } =
    useChat({
      id,
      initialMessages,
      body: {
        id,
        model: selectedModelName,
      },
      onError: (error) => {
        // Handle the error response
        let errorMessage = '';
        try {
          // If it's a JSON string, parse it
          if (typeof error.message === 'string' && error.message.startsWith('{')) {
            const parsed = JSON.parse(error.message);
            errorMessage = parsed.error;
          } else {
            errorMessage = error.message;
          }
        } catch (e) {
          errorMessage = error.message;
        }

        if (errorMessage.toLowerCase().includes('usage limit')) {
          toast(
            <div className="flex items-center justify-between gap-4">
              <span>{errorMessage}</span>
              <button
                onClick={() => {
                  openModal();
                  toast.dismiss();
                }}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Upgrade
              </button>
            </div>,
            {
              duration: 8000,
              style: {
                background: theme === 'dark' ? 'black' : 'white',
                border: theme === 'dark' ? '1px solid rgb(31,41,55)' : '1px solid rgb(229,231,235)',
                color: theme === 'dark' ? 'white' : 'black',
              }
            }
          );
        } else {
          toast.error(errorMessage);
        }
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader selectedModelName={selectedModelName} />
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll"
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message) => (
          <PreviewMessage
            key={message.id}
            role={message.role}
            content={message.content}
            attachments={message.experimental_attachments}
            toolInvocations={message.toolInvocations}
          />
        ))}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          append={append}
        />
      </div>
    </div>
  );
}
