'use client';

import { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';

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
  userMembership = 'free',
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelName: Model['name'];
  userMembership?: string;
}) {
  const { theme } = useTheme();
  const { openModal } = useModal();

  const { messages, append, reload, stop, isLoading, input, setInput, handleSubmit, setMessages } =
    useChat({
      id,
      initialMessages,
      body: {
        id,
        model: selectedModelName,
      },
      onResponse: (response) => {
        console.log('Chat response received:', response.status, response.ok);
        if (!response.ok) {
          console.error('Chat response error:', response.status, response.statusText);
        }
      },
      onFinish: (message) => {
        // Simple completion handling without auto-continuation
        console.log('Message completed:', message.id, 'Content length:', message.content.length);
        
        // Refresh the sidebar history to show the updated chat
        mutate('/api/history');
      },
      onError: (error) => {
        // Handle the error response
        let errorMessage = '';
        let lastMessage = '';
        try {
          // If it's a JSON string, parse it
          if (typeof error.message === 'string' && error.message.startsWith('{')) {
            const parsed = JSON.parse(error.message);
            errorMessage = parsed.error;
            lastMessage = parsed.lastMessage;
          } else {
            errorMessage = error.message;
          }
        } catch (e) {
          errorMessage = error.message;
        }

        console.error('Chat error:', errorMessage, 'Full error:', error);

        if (errorMessage.toLowerCase().includes('usage limit')) {
          // Set the input back to the last message
          if (lastMessage) {
            setInput(lastMessage);
          }
          
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
        } else if (errorMessage.toLowerCase().includes('failed to generate response')) {
          toast.error('Connection error. Please try again.');
          // Refresh history in case the message was saved
          mutate('/api/history');
        } else {
          toast.error(errorMessage);
        }
      },
    });

  // Refresh history when component mounts with existing messages
  useEffect(() => {
    if (initialMessages.length > 0) {
      mutate('/api/history');
    }
  }, []);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>(messages, isLoading);

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const handleMessageEdit = async (messageId: string, newContent: string): Promise<boolean> => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      toast.error('Message not found');
      return false;
    }

    // Create a new array with messages up to (but not including) the edited message
    const updatedMessages = messages.slice(0, messageIndex).map(message => message);

    // Update the messages state immediately
    setMessages(updatedMessages);

    // Create a new prompt with the edited message
    try {
      // This will add the edited message as a new message
      append({
        role: 'user',
        content: newContent,
      });
      return true;
    } catch (error) {
      toast.error('Failed to update conversation');
      return false;
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader selectedModelName={selectedModelName} userMembership={userMembership} />
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-10 flex-1 overflow-y-scroll scrollbar-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(156 163 175) transparent'
        }}
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message) => (
          <PreviewMessage
            key={message.id}
            id={message.id}
            role={message.role}
            content={message.content}
            attachments={message.experimental_attachments}
            toolInvocations={message.toolInvocations}
            onEdit={handleMessageEdit}
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
